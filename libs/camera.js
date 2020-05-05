import {isMobile} from "./helper.js"

const videoWidth = 600;
const videoHeight = 500;
/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }
  
    const video = document.getElementById('video');
    video.width = videoWidth;
    video.height = videoHeight;
  
    const mobile = isMobile();
    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
        width: mobile ? undefined : videoWidth,
        height: mobile ? undefined : videoHeight,
      },
    });
    video.srcObject = stream;
  
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }
  
async function loadVideo() {
    const video = await setupCamera();
    video.play();
  
    return video;
  }
  
/**
 * Kicks off the demo by loading the posenet model, finding and loading
 * available camera devices, and setting off the detectPoseInRealTime function.
 */
export async function bindPage() {
    // let video;
  
    try {
      return await loadVideo();
    } catch (e) {
      let info = document.getElementById('info');
    //   info.textContent = 
      console.log('this browser does not support video capture,' +
          'or this device does not have a camera');
    //   info.style.display = 'block';
      throw e;
    }
  }

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
// kick off the demo
bindPage();
