import FaceRecognition from "../libs/FaceRecognition.js"
const input = document.getElementById('video')
const message = document.getElementById('message')
const host = window.location.href
const labels = [
    //'Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 
    'Tony Stark', 
    'Wesam'
];
var faceRecognition = new FaceRecognition(host);
(async () => { 
    await faceRecognition.init(labels)

    // Start video
    navigator.getUserMedia(
        { video: {} },
        stream => input.srcObject = stream,
        err => console.error(err)
    )
    // Print completion message
    message.innerText = 'Models and descriptors have been Loaded'

    // Start recognition once the camera starts
    input.addEventListener('play', async () => {
        await faceRecognition.recognize(input, printLabels)
    })
    
})()

function printLabels(detectedFaces){
    if(detectedFaces) {
        message.innerText = ""
        message.innerText += detectedFaces.map(x => x.toString())
    }
}