import Camera from "../lib/Camera.js"
import FaceRecognition from "../lib/FaceRecognition.js"
const message = document.getElementById('message')
const host = window.location.href
const labels = [
    //'Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 
    'Tony Stark', 
    'Wesam'
];
let interval = 100
var faceRecognition = new FaceRecognition(host);
var camera = new Camera();
(async () => { 
    console.log("init the app...")
    await faceRecognition.init(labels)

    // Start video
    try {
        faceRecognition.video = await camera.start()
    } catch(err) {
        console.error(err)
    }
    // Print completion message
    message.innerText = 'Models and descriptors have been Loaded'

    // Start recognition once the camera starts
    camera.video.addEventListener('play', async () => {
        // console.log(faceRecognition.input)
       await faceRecognition.recognize(printLabels)
    })
    
})()

function printLabels(detectedFaces){
    if(detectedFaces) {
        message.innerText = "Hi, "
        message.innerText += " " + detectedFaces.map(x => x.toString())
    }
}