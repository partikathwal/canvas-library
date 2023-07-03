/** @type {HTMLCanvasElement} */
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;


class InputHandler {
    // upPressed = false;
    // downPressed = false;
    // leftPressed = false;
    // rightPressed = false;
    constructor(){
        // window.addEventListener("keydown", (e) => {
        //     if(e.key === "ArrowUp"){
        //         this.downPressed = false;
        //         this.upPressed = true;
        //     }else
        //     if(e.key === "ArrowDown"){
        //         this.upPressed = false;
        //         this.downPressed = true;
        //     }else
        //     if(e.key === "ArrowLeft"){
        //         this.leftPressed = true;
        //         this.rightPressed = false;
        //     }else
        //     if(e.key === "ArrowRight"){
        //         this.leftPressed = false;
        //         this.rightPressed = true;
        //     }
        // })

        // window.addEventListener("keyup", (e) => {
        //     if(e.key === "ArrowUp"){
        //         this.upPressed = false;
        //     }else
        //     if(e.key === "ArrowDown"){
        //         this.downPressed = false;
        //     }else
        //     if(e.key === "ArrowLeft"){
        //         this.leftPressed = false;
        //     }else
        //     if(e.key === "ArrowRight"){
        //         this.rightPressed = false;
        //     }
        // })
    }
    upPressed(){
        return navigator.getGamepads()[0].buttons[12].pressed
    }
    downPressed(){
        return navigator.getGamepads()[0].buttons[13].pressed
    }
    leftPressed(){
        return navigator.getGamepads()[0].buttons[14].pressed
    }
    rightPressed(){
        return navigator.getGamepads()[0].buttons[15].pressed
    }
}

class Player {
    constructor(game){
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.width = 64;
        this.height = 64;
        this.speed = 5;
        this.sprite = document.getElementById("sprite");
        this.spriteX = 0;
        this.spriteY = 0;
        this.stepTimer = 0;
        this.stepInterval = 100;
    }
    update(deltaTime){
        if(this.game.inputHandler.upPressed()){
            this.y -= this.speed;
            this.spriteY = 3;
            if(this.stepTimer >= this.stepInterval){
                this.spriteX = (this.spriteX === 3) ? 0 : (this.spriteX + 1);
                this.stepTimer = 0;
            }else{
                this.stepTimer += deltaTime;
            }
        }
        if(this.game.inputHandler.downPressed()){
            this.y += this.speed;
            this.spriteY = 0;
            if(this.stepTimer >= this.stepInterval){
                this.spriteX = (this.spriteX === 3) ? 0 : (this.spriteX + 1);
                this.stepTimer = 0;
            }else{
                this.stepTimer += deltaTime;
            }
        }
        if(this.game.inputHandler.leftPressed()){
            this.x -= this.speed;
            this.spriteY = 1;
            if(this.stepTimer >= this.stepInterval){
                this.spriteX = (this.spriteX === 3) ? 0 : (this.spriteX + 1);
                this.stepTimer = 0;
            }else{
                this.stepTimer += deltaTime;
            }
        }
        if(this.game.inputHandler.rightPressed()){
            this.x += this.speed;
            this.spriteY = 2;
            if(this.stepTimer >= this.stepInterval){
                this.spriteX = (this.spriteX === 3) ? 0 : (this.spriteX + 1);
                this.stepTimer = 0;
            }else{
                this.stepTimer += deltaTime;
            }
        }
        const { upPressed, downPressed, leftPressed, rightPressed } = this.game.inputHandler;
        if(!upPressed() && !downPressed() && !leftPressed() && !rightPressed()) {
            this.spriteX = 0;
        }
    }
    /** @param {CanvasRenderingContext2D} context */
    draw(context){
        context.drawImage(this.sprite, this.spriteX * this.width, this.spriteY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

class Game {
    constructor(){
        this.player = new Player(this);
        this.inputHandler = new InputHandler();
        this.background = document.getElementById("land");
    }
    update(deltaTime){
        this.player.update(deltaTime)
    }
    /** @param {CanvasRenderingContext2D} context */
    draw(context){
        context.drawImage(this.background, 0, 0);
        this.player.draw(context);
    }
}


window.addEventListener("gamepadconnected", () => {
    const game = new Game();
    
    let lastTime = 0;

    function animate(timestamp){
        const btn = navigator.getGamepads()[0].buttons.find(b => b.pressed);
        if(btn){
            console.log(navigator.getGamepads()[0].buttons.indexOf(btn));
        }
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate)
    }
    animate(0)
})