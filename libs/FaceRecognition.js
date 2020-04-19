export default class {
    constructor(host, input, message){
        this.host = host    
        this.input = input
        this.message = message   
    }

    async init(labels){        
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(this.host + '/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri(this.host + '/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri(this.host + '/models'),
           // faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
            // faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ])       

        let labeledFaceDescriptors = await this.loadDescriptors(labels)
        this.faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)    
    }

    async getDescriptor(label) {
        try {
            return await localforage.getItem(label);
        } catch (err) {
            console.log(err);
        }
    }

    async setDescriptor(label, descritpor) {
        return await localforage.setItem(label, descritpor);
    }

    async loadDescriptorImages(label) {
        let descriptions = []
        let total = (label== "Wesam") ? 7 : 2;
        for (let i = 1; i <= total; i++) {
            const img = await faceapi.fetchImage(`${this.host}/training_images/${label}/${i}.jpg`)
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
            descriptions.push(detections.descriptor)
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
    }

    /**
     * loadDescriptors
     */
    async loadDescriptors(labels) {
        let descriptors = []        
        for(let label of labels ) {   
            let descriptor = await this.getDescriptor(label)
            if(!descriptor){
                descriptor = await this.loadDescriptorImages(label)
                await this.setDescriptor(label, descriptor)
            } else {
                descriptor = new faceapi.LabeledFaceDescriptors(descriptor._label, descriptor._descriptors)
            }
            descriptors.push(descriptor)
        }
        return descriptors
    }

    async detectFaces() {     
        const results = await faceapi
            .detectAllFaces(this.input, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors()
    
        if (!results.length) {
            console.log("no faces")
            return
        }
        results.forEach(fd => {
            const bestMatch = this.faceMatcher.findBestMatch(fd.descriptor)
            this.message.innerText = bestMatch.toString()
        })
    }
}