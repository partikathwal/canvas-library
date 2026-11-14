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

export class KeyboardKey {
    pressed = false
    onPress(){}
}

export class Keyboard {

    static keys = {};

    /** @returns {KeyboardKey} */
    static initKey(key){
        if(!Keyboard.keys[key]) Keyboard.keys[key] = new KeyboardKey();

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
            const k = Keyboard.initKey(e.code);

            k.pressed = true;
            k.onPress?.();
        });

        document.addEventListener('keyup', (e) => {
            Keyboard.initKey(e.code);

            Keyboard.keys[e.code].pressed = false;
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


export class Shape {
    x;
    y;
    w;
    h;

    constructor({x = 0, y = 0, w = 0, h = 0} = {}){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

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
        super({x, y, w, h});
    }

    draw(context){
        context.fillRect(this.x, this.y, this.w, this.h);
    }
}

export class Circle extends Shape {
    constructor({ centerX = 100, centerY = 100, radius = 10 } = {}){
        super({
            x: centerX - radius,
            y: centerY - radius,
            w: (radius * 2),
            h: (radius * 2),
        });
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

        for(const screen of this.screens){
            screen.game = this;
        }

        this.activeScreen = this.screens[0];
    }

    start(){
        this.activeScreen.init();
        this.canvas.animate(() => {
            this.activeScreen.update();
            this.activeScreen.draw(this.context);
        })
    }
}

export class Screen {
    #initFunction
    #updateFunction;
    #drawFunction;

    /** @type {Game} */
    game = null;

    constructor(initFunction){
        this.#initFunction = initFunction;
    }

    init(){
        const functions = this.#initFunction(this);
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
        newScreen.init();
        this.game.activeScreen = newScreen;
    }
}

export class Sprite2 extends Shape {

    // Sprite shouldn't have a position
    // it's draw method should inherit its position from whoever's sprite it is
    // mario has a position, draw his sprite at his position
    // maybe that applies to the final width and height?
    // the sprite just needs to know which frame in the original image to draw
    // and then mario will HAVE a sprite. It's not that mario IS a sprite.
    
    ready = false;
    cycles = {}

    activeCycle = null;
    activeFrameIndex = 0;

    frameCounter = 0;
    frameRate = 10;

    direction = 1;

    constructor(imagePath, { x, y, w, h, scale = 1, cycles, frameRate } = {}){
        super({x, y, w, h});

        this.image = new Image();
        this.image.src = imagePath;
        this.image.onload = () => this.ready = true;

        this.scale = scale;
        this.cycles = cycles ?? {};
        this.frameRate = frameRate ?? 10;
    }

    setCycle(cycle){
        if(this.activeCycle === cycle) return;

        this.activeCycle = cycle;
        this.activeFrameIndex = 0;
    }

    nextFrame(){
        if(!this.ready || !this.activeCycle) return;

        this.activeFrameIndex++;
        if(this.activeFrameIndex === this.activeCycle.length){
            this.activeFrameIndex = 0;
        }
    }

    update(factor = 1){
        this.frameCounter++;
        if(this.frameCounter >= (this.frameRate / factor)){
            this.nextFrame();
            this.frameCounter = 0;
        }
    }

    /** @param {CanvasRenderingContext2D} context */
    draw(context){
        if(!this.ready) return;
        const frame = this.activeCycle[this.activeFrameIndex];
        context.drawImage(this.image, frame.x, frame.y, this.w, this.h, this.x, this.y, this.w * this.scale, this.h * this.scale)
    }
}

export class Sprite {
    frame = {}
    cycles = {}

    activeCycle = null
    activeFrame = 0;
    counter = 0;


    // don't keep these here
    // a sprite is just about displaying an image in a special way
    // it doesn't have to move, or be controllable
    // that's a Moveable object
    // A Moveable object should have properties and physics
    // But it's behavior should be defined outside of that
    //  Maybe I need to simplify things and avoid acceleration, just constant speed
    // Also some controls, like menus, need something like event handling
    accelerationX = 1;
    decelerationX = 0.25;
    maxSpeedX = 10;

    speedX = 0;
    speedY = 0;

    direction = 1;

    

    // states test
    // Notes: instead of the controller doing stuff, it should simply change the state of the object
    // and the object will handle it's behavior when it is in a certain state
    // There may be overlaps of state, but that will all be determined by how the object composes the condition checks and stuff
    // The controller code should be dumb.
    states = {
        WALKING: 'WALKING_RIGHT',
        STANDING: 'STANDING_RIGHT',
    }
    activeState = 'STANDING'

    constructor(imagePath, config){
        // original image
        this.image = new Image();
        this.image.src = imagePath;
        this.imageReady = false;
        this.image.onload = () => {
            this.imageReady = true;
        }

        // where to cut it
        this.frame.w = config.frame.w;
        this.frame.h = config.frame.h;

        // where to put it
        this.x = config.x;
        this.y = config.y;
        this.w = config.w ?? config.frame.w;
        this.h = config.h ?? config.frame.h;

        this.cycles = config.cycles;
    }

    get currentCycle(){
        const names = Object.keys(this.cycles);
        for(const name of names){
            if(this.cycles[name] === this.activeCycle){
                return name;
            }
        }
    }

    setCycle(cycleName){
        this.activeCycle = this.cycles[cycleName];
        this.activeFrame = 0;
    }

    update(){
        if(this.activeState === this.states.STANDING){
            if(Math.abs(this.speedX) > 0.1){ // slow down
                this.speedX += (this.decelerationX * this.direction * -1);
                this.x += this.speedX;
            }else
            if(Math.abs(this.speedX) > 0){ // if super slow then stop
                this.speedX = 0;
            }
        }else
        if(this.activeState === this.states.WALKING){
            if(Math.abs(this.speedX) < this.maxSpeedX){
                this.speedX += (this.accelerationX * this.direction);
            }
            this.x += this.speedX;
        }


        this.counter++;
        if(this.counter === 10){
            this.activeFrame++;
            if(this.activeFrame === this.activeCycle.length){
                this.activeFrame = 0;
            }
            this.counter = 0;
        }
    }

    /** @param {CanvasRenderingContext2D} context  */
    draw(context){
        if(this.imageReady){
            context.drawImage(
                this.image,
                this.activeCycle[this.activeFrame].x,
                this.activeCycle[this.activeFrame].y,
                this.frame.w,
                this.frame.h,
                this.x,
                this.y,
                this.w,
                this.h
            );
        }
    }
}

export class Point {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

export class Layer {
    objects = [];

    constructor(objectArray){
        this.objects = objectArray;
    }

    draw(){
        for(const object of this.objects){
            object.draw();
        }
    }
}