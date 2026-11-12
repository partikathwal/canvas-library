import { Box, Circle } from "./lib.js";


export class Ball extends Circle {
    speedX;
    speedY;

    image;
    imageReady = false;

    rotation = 0;

    constructor(config){
        super(config);

        this.resetTrajectory('right')
        this.image = new Image();
        this.image.src = './test files/pearl.png'
        this.image.onload = () => this.imageReady = true;
    }

    get angle(){
        return Math.atan(this.speedY / this.speedX);
    }

    resetTrajectory(direction){
        const factor = direction === 'left' ? (-3/4) : (1/4)
        const angle = Math.random() * (Math.PI/2) - (Math.PI * factor);
        this.speedX = Math.cos(angle) * 2;
        this.speedY = Math.sin(angle) * 2;
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        if(!this.imageReady) return;
        drawRotatedImage(context, this.image, this.centerX, this.centerY, this.w, this.h, this.rotation)
        this.rotation -= 2;
        if(this.rotation === -360) this.rotation = 0
    }
}

export class Paddle extends Box {
    speedY = 2;

    image;
    imageReady = false;

    constructor(config){
        super(config);
        this.speedY = config.speedY;

        this.image = new Image();
        this.image.src = './test files/shell.png'
        this.image.onload = () => this.imageReady = true;
    }

    moveUp(){
        this.y -= this.speedY;
    }
    moveDown(){
        this.y += this.speedY;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context, reverse = false){
        if(!this.imageReady) return;

        if(reverse){
            context.save();
            context.scale(-1, 1);
            context.drawImage(this.image, -this.x - this.w, this.y, this.w, this.h);
            context.restore(); // 4
        }else{
            context.drawImage(this.image, this.x, this.y, this.w, this.h);
        }

    }

    // TODO:
    // I want slight acceleration and deceleration
    // that requires some 'onRelease' functionality of Keyboard
}

//============

function drawRotatedImage(ctx, img, x, y, w, h, degrees) {
    // 1. Convert degrees to radians
    const radians = degrees * Math.PI / 180;

    // 2. Save the current unrotated canvas state
    ctx.save();

    // 3. Move the canvas origin (0,0) to the destination coordinates
    ctx.translate(x, y);

    // 4. Rotate the canvas grid
    ctx.rotate(radians);

    // 5. Draw the image offset by half its width and height 
    // so that its center aligns perfectly with the origin
    ctx.drawImage(img, -w / 2, -h / 2, w, h);

    // 6. Restore the canvas state back to how it was before
    ctx.restore();
}