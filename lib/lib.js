export class Canvas {

    /**
     * 
     * @param {object} config 
     * @param {number} config.width 
     * @param {number} config.height 
     * 
     */
    constructor(config = {}){
        /** @type { HTMLCanvasElement } */
        const canvas = document.createElement('canvas');
        
        canvas.width = config.width ?? 640;
        canvas.height = config.height ?? 480;
        canvas.style.border = '1px solid black';

        document.body.appendChild(canvas);

        this.element = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        this.top = 0;
        this.left = 0;
        this.right = canvas.width;
        this.bottom = canvas.height;

        this.context = canvas.getContext('2d');
    }

    clear(){
        this.context.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Gonna ignore deltaTime for now
     * @param {FrameRequestCallback} callback 
     */
    animate(callback){
        requestAnimationFrame(() => {
            this.clear();
            callback();
            this.animate(callback);
        })
    }

    drawBox(box){
        this.context.fillRect(box.x, box.y, box.w, box.h);
    }
}

export class KeybaordKey {
    pressed = false
    onPress(){}
}

export class Keyboard {

    static keys = {};

    /** @returns {KeybaordKey} */
    static initKey(key){
        if(!Keyboard.keys[key]) Keyboard.keys[key] = new KeybaordKey();

        return Keyboard.keys[key];
    }

    static onPressProbablyWontWorkWell(key, callback){
        const keyboardKey = Keyboard.initKey(key);
        keyboardKey.onPress = callback;
    }

    static isPressed(key){
        Keyboard.initKey(key);

        return Keyboard.keys[key].pressed;
    }

    static {
        document.addEventListener('keydown', (e) => {
            const k = Keyboard.initKey(e.key);

            k.pressed = true;
            k.onPress?.();
        });

        document.addEventListener('keyup', (e) => {
            Keyboard.initKey(e.key);

            Keyboard.keys[e.key].pressed = false;
        });
    }

}

export class Controller {
    static UP = 'up'
    static DOWN = 'down'
    static LEFT = 'left'
    static RIGHT = 'right'

    static onPress = {
        left: () => {},
        right: () => {},
        up: () => {},
        down: () => {},
    }

    static onRelease = {
        left: () => {},
        right: () => {},
        up: () => {},
        down: () => {},
    }

    static isPressed = {
        left: false,
        right: false,
        up: false,
        down: false,
    }

    static #keyToDirection = new Map([
        ['ArrowLeft', 'left'],
        ['ArrowRight', 'right'],
        ['ArrowUp', 'up'],
        ['ArrowDown', 'down'],
    ])

    static {
        document.addEventListener('keydown', (e) => {
            const direction = Controller.#keyToDirection.get(e.key);
            if(!direction) return;

            Controller.isPressed[direction] = true;
            Controller.onPress[direction]?.();
        });

        document.addEventListener('keyup', (e) => {
            const direction = Controller.#keyToDirection.get(e.key);
            if(!direction) return;

            Controller.onRelease[direction]?.();
            Controller.isPressed[direction] = false;
        });
    }

    /**
     * controller.on(Controller.UP, () => { elevator.activate() })
     */

    static #on(key, callback, once = true){
        Controller.onPress[key] = () => {
            if(once) Controller.onPress[key] = null;
            callback();
        }
    }

    static on(key, callback){
        Controller.#on(key, callback, false);
    }
    static once(key, callback){
        Controller.#on(key, callback, true);
    }
}


class Shape {
    x;
    y;
    w;
    h;

    constructor(){}

    get left(){ return this.x }
    get right(){ return this.x + this.w }
    get top(){ return this.y }
    get bottom(){ return this.y + this.h }

    /**
     * @param {Shape} shape 
     */
    overlapsWith(shape, dx = 0, dy = 0){
        const willOverlap = (this.bottom + dy >= shape.top) &&
            (this.top + dy <= shape.bottom) &&
            (this.left + dx <= shape.right) &&
            (this.right + dx >= shape.left);

        if(willOverlap) return willOverlap;

        // TODO: Add tunneling checks... but how?
        // If after dx and dy it is overlapping, then that's it
        // but what if after dx and dy it is NOT overlapping
        // either it's not there yet, or it passed through
        // so here we know it's not overlapping,
        // but we're comparing before and after to see if it passes through

        const bottom_now = this.bottom;
        const bottom_after = this.bottom + dy;
        const top_now = this.top;
        const top_after = this.top + dy;
        const left_now = this.left;
        const left_after = this.left + dx;
        const right_now = this.right;
        const right_after = this.right + dx;

        const willPass = (
            (right_now < shape.left && right_after > shape.left) ||
            (left_now > shape.right && left_after < shape.right)
        ) &&
        (
            (top_now > shape.bottom && top_after < shape.bottom) ||
            (bottom_now < shape.top && bottom_after > shape.top)
        )

        // I think this works, but fails in extreme cases, where the speed is so much,
        // that it detects a collision in the next step, turns around,
        // and steps out of bounds the other way without checking for a collision
        // Lets just not ever have anything that steps like half the screen in one frame
        // and still expects to respond to collision detection
        // Otherwise it works fine
        // I should time how long a game can last with and without the logic
        // use a fixed starting angle
        //
        // Update!
        // Results:
        // (64) Collision!
        // 45.409334398436684 1.1023554344403979
        // (64) Collision!
        // 45.409334398436684 0
        // (64) Collision!
        // 45.409334398436684 0
        // So after exactly 64 collisions (each time a 1.05 bump up in speed) it reaches a speedX of exactly 45.409334398436684...
        // I expected the speed to be much higher before it failed
        // And its the same with or without the willPass logic
        // So I don't think my willPass logic is working.

        return willPass;
    }
}

export class Box extends Shape {

    constructor({x = 0, y = 0, w = 50, h = 50} = {}){
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get left(){ return this.x }
    get right(){ return this.x + this.w }
    get top(){ return this.y }
    get bottom(){ return this.y + this.h }

    draw(context){
        context.fillRect(this.x, this.y, this.w, this.h);
    }
}

export class Circle extends Shape {
    constructor({ centerX = 100, centerY = 100, radius = 10 } = {}){
        super();
        this.x = centerX - radius;
        this.y = centerY - radius;
        this.w = this.h = (radius * 2);
        this.radius = radius;
    }

    get centerX(){ return this.x + this.radius }
    get centerY(){ return this.y + this.radius }


    /** @param {CanvasRenderingContext2D} context */
    draw(context){
        context.beginPath();
        context.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = 'black'
        context.fill();
    }
}

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

export class ImageBox extends Box {
    image;
    imageReady = false;
    blur = false;

    constructor(config){
        super(config);

        this.image = new Image();
        this.image.src = config.imagePath;
        this.image.onload = () => this.imageReady = true;
        this.blur = config.blur ?? false;
    }

    draw(context){
        if(this.blur) context.filter ='blur(4px)'
        context.drawImage(this.image, this.x, this.y, this.w, this.h);
        if(this.blur) context.filter ='none';
    }
}

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

//=====================

export class Game {
    screens;
    activeScreen;

    canvas;
    context;

    /**
     * 
     * @param {Screen[]} screenArray 
     */
    constructor(screenArray){
        this.canvas = new Canvas();
        this.context = this.canvas.context;

        this.screens = screenArray;
        // TODO: attach `this` (the game instance) to each Screen in the list, so they have access to it
        this.activeScreen = this.screens[0];
    }

    start(){
        this.canvas.animate(() => {
            this.activeScreen.update();
            this.activeScreen.draw(this.context);
        })
    }
}

export class Screen {
    #updateFunction;
    #drawFunction;

    constructor(initFunction){
        const functions = initFunction(this);
        this.#updateFunction = functions.update;
        this.#drawFunction = functions.draw;
    }

    update(){
        this.#updateFunction();
    }

    draw(context){
        this.#drawFunction(context);
    }

    navigate(newScreen){

    }
}