const input = document.getElementById('video')
const message = document.getElementById('message')
const host = window.location.href

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(host + '/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri(host + '/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri(host + '/models'),
    // faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    // faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

let faceMatcher

async function startVideo() {
    let labeledFaceDescriptors = await getDescriptors()
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)

    navigator.getUserMedia(
        { video: {} },
        stream => input.srcObject = stream,
        err => console.error(err)
    )
    message.innerText = 'Models and descriptors have been Loaded'
}

video.addEventListener('play', async () => {
    setInterval(detectFaces,1000)
})

async function detectFaces() {
    const results = await faceapi
        .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()

    if (!results.length) {
        console.log("no faces")
        return
    }
    results.forEach(fd => {
        const bestMatch = faceMatcher.findBestMatch(fd.descriptor)
        message.innerText = bestMatch.toString()
    })
}

function toArray(obj) {
    return Object.keys(obj).map( (key) => { 
        return [obj[key]]; 
    })
}

async function getDescriptors() {
    let descriptorsArray = await faceapi.fetchJson(host + "/descriptors/face_descriptors.json")

    const descriptors = descriptorsArray.map((d) => {
        let descriptions = d._descriptors.map((dd) => {          
            return new Float32Array(toArray(dd))
        })
        return new faceapi.LabeledFaceDescriptors(d._label, descriptions)
    });
    return descriptors
} 

function loadLabeledImages() {
    const labels = [
        //'Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 
        'Tony Stark', 
        'Wesam']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            let total = (label== "Wesam") ? 7 : 2;
            for (let i = 1; i <= total; i++) {
                const img = await faceapi.fetchImage(`${host}/training_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}