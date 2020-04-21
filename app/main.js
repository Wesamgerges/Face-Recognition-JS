import FaceRecognition from "../libs/FaceRecognition.js"
const input = document.getElementById('video')
const message = document.getElementById('message')
const host = window.location.href
const labels = [
    //'Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 
    'Tony Stark', 
    'Wesam'
];
let interval = 100
var faceRecognition = new FaceRecognition(host);
(async () => { 
    console.log("init the app...")
    await faceRecognition.init(labels)

    // Start video
    try {
        let stream = await navigator.mediaDevices.getUserMedia(
            { video: {} },            
        )
        input.srcObject = stream
    } catch(err) {
        console.error(err)
    }
    // Print completion message
    message.innerText = 'Models and descriptors have been Loaded'

    // Start recognition once the camera starts
    input.addEventListener('play', async () => {
        await faceRecognition.recognize(input, interval, printLabels)
    })
    
})()

function printLabels(detectedFaces){
    if(detectedFaces) {
        message.innerText = "Hi, "
        message.innerText += " " + detectedFaces.map(x => x.toString())
    }
}