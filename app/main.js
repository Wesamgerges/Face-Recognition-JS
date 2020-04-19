import FaceRecognition from "../libs/FaceRecognition.js"
const input = document.getElementById('video')
const message = document.getElementById('message')
const host = window.location.href
const labels = [
    //'Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 
    'Tony Stark', 
    'Wesam'
];
var faceRecognition = new FaceRecognition(host, input, message);
(async () => { 
    await faceRecognition.init(labels)
    navigator.getUserMedia(
        { video: {} },
        stream => input.srcObject = stream,
        err => console.error(err)
    )
    message.innerText = 'Models and descriptors have been Loaded'
    input.addEventListener('play', async () => {
        await callback()
    })
    
})()
var loop = true
async function callback(){    
    // to slow down how many times we scan for faces
    setTimeout(async () => {
        await faceRecognition.detectFaces()
        if(loop) await callback()
    },1000)
}
