/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

class Controller {

    static LEFT = "left";
    static RIGHT = "right";
    static UP = "up";
    static DOWN = "down";
    static SPACEBAR = "spacebar";

    // state
    #left = false;
    #right = false;
    #up = false;
    #down = false;
    #spacebar = false;

    // these would be set to functions with 
    #press = {
        left: null,
        right: null,
        up: null,
        down: null,
        spacebar: null,
    };

    #hold = {
        left: null,
        right: null,
        up: null,
        down: null,
        spacebar: null,
    };

    #release = {
        left: null,
        right: null,
        up: null,
        down: null,
        spacebar: null,
    }

    constructor(){
        document.addEventListener("keydown", (e) => {
            if(e.key === "ArrowLeft"){
                if(this.#left) return false;
                this.#left = true;
                this.#press.left?.()
            }else
            if(e.key === "ArrowRight"){
                if(this.#right) return false;
                this.#right = true;
                this.#press.right?.()
            }else
            if(e.key === "ArrowUp"){
                if(this.#up) return false;
                this.#up = true;
                this.#press.up?.()
            }else
            if(e.key === "ArrowDown"){
                if(this.#down) return false;
                this.#down = true;
                this.#press.down?.()
            }else
            if(e.key === " "){
                if(this.#spacebar) return false;
                this.#spacebar = true;
                this.#press.spacebar?.()
            }
        });

        document.addEventListener("keyup", (e) => {
            if(e.key === "ArrowLeft"){
                this.#left = false;
                this.#release.left?.();
            }else
            if(e.key === "ArrowRight"){
                this.#right = false;
                this.#release.right?.();
            }else
            if(e.key === "ArrowUp"){
                this.#up = false;
                this.#release.up?.();
            }else
            if(e.key === "ArrowDown"){
                this.#down = false;
                this.#release.down?.();
            }else
            if(e.key === " "){
                this.#spacebar = false;
                this.#release.spacebar?.();
            }
        })
    }

    onPress(key, action, _this){
        this.#press[key] = action.bind(_this);
    }

    onRelease(key, action, _this){
        this.#release[key] = action.bind(_this);
    }

    onHold(key, action, _this){
        this.#hold[key] = action.bind(_this);
    }

    update(){ // to be run on each frame by the game loop
        if(this.#left) this.#hold.left?.();
        if(this.#right) this.#hold.right?.();
        if(this.#up) this.#hold.up?.();
        if(this.#down) this.#hold.down?.();
        if(this.#spacebar) this.#hold.spacebar?.();
    }
}


const controller = new Controller();

class Player {
    x = 100;
    y = 200;
    w = 50;
    h = 50;
    speedX = 5;
    speedY = 0;
    inMidAir = false;

    constructor(){
        controller.onHold(Controller.LEFT, this.walkLeft, this);
        controller.onHold(Controller.RIGHT, this.walkRight, this);
        controller.onPress(Controller.SPACEBAR, this.jump, this);
    }

    walkLeft(){
        this.x -= this.speedX;
    }

    walkRight(){
        this.x += this.speedX;
    }

    jump(){
        this.inMidAir = true;
        this.speedY = 25;
    }

    fall(){
        if(this.inMidAir){
            // check if landed
            const floorY = this.getFloor();
            if((this.y - this.speedY) >= floorY){
                this.y = floorY;
                this.inMidAir = false;
            }else{
                this.y -= this.speedY; // move
                this.speedY-- // decelerate
            }
        }
    }

    getFloor(){ // maybe this doesn't have to be in the player's logic?
        // something more advanced
        return 500;
    }

    draw(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    update(){
        this.fall();
    }
}

const player = new Player();

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    player.draw();
    controller.update();
    requestAnimationFrame(animate);
}

animate();