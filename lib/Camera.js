import {isMobile} from "./helper.js"

/**
 * Loads a the camera to be used in the demo
 *
 */
export default class {
    constructor(videoWidth = 60, videoHeight = 50) {
        this.videoWidth = videoWidth;
        this.videoHeight = videoHeight;
        
        navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }

    async setup() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
        }
    
        const video = document.getElementById('video');
        video.width = this.videoWidth;
        video.height = this.videoHeight;
    
        const mobile = isMobile();
        const stream = await navigator.mediaDevices.getUserMedia({
            'audio': false,
            'video': {
                facingMode: 'user',
                width: mobile ? undefined : this.videoWidth,
                height: mobile ? undefined : this.videoHeight,
            },
        });
        video.srcObject = stream;
    
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    }

    async start() {
        try {
            this.video = await this.setup();
            this.video.play();
            return this.video;
        } catch (e) {    
            throw e;
        }
    }
}
