import { controller } from "./GameController.js";
import { canvas, ctx } from "./canvas.js";

class GameScreen {
    player;
    platforms = [];

    constructor(){
        this.gameMap = new GameMap();
        this.player = new Player(this.gameMap);
    }

    activate(){
        controller.setMapping({});
        this.platforms.push(new Platform({ x: 0, y: canvas.height + this.player.height + 100, width: this.gameMap.width, gameMap: this.gameMap }))
        this.platforms.push(new Platform({ x: 0, y: 400, width: canvas.width, gameMap: this.gameMap, height: 100 }));
        this.platforms.push(new Platform({ x: 300, y: 300, width: 200, gameMap: this.gameMap }));
    }
    draw(){
        this.gameMap.draw();
        this.platforms.forEach(p => p.draw());
        this.player.draw();
    }
    update(){
        this.player.update();
    }
}

class Platform {
    x;
    y;
    width;
    height;
    gameMap;

    constructor({ x, y, width, height, gameMap }){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height || 20;
        this.gameMap = gameMap;
    }

    draw(){
        ctx.fillStyle = "#00f";
        ctx.fillRect(this.x + this.gameMap.x, this.y + this.gameMap.y, this.width, this.height);
    }
}

class Player {
    x = 100;
    y = canvas.height - 300;
    width = 160;
    height = 160;
    speedX = 0;
    speedY = 0;
    walkSpeed = 5;
    jumpSpeed = 15;
    gravity = 0.5;
    inMidAir = false;
    floor = null;
    sprite = {
        image: new Image(),
        row: 0,
        column: 0,
        counter: 0
    }

    constructor(gameMap){
        this.gameMap = gameMap;
        this.sprite.image.src = "../sprites/player.png";
    }

    getFloor(){
        return gameScreen.platforms.filter(p => {
            return (this.x + this.width) > p.x &&
                this.x < (p.x + p.width) &&
                (this.y + this.height) <= p.y;
        }).sort((a,b) => a.y - b.y)[0];
    }
    walk(){

    }
    jump(){
        
    }
    draw(){
        //ctx.fillStyle = "red";
        //ctx.fillRect(this.x + this.gameMap.x, this.y + this.gameMap.y, this.width, this.height);
        const interval = this.sprite.row % 2 === 0 ? 100 : 10;
        this.sprite.counter++;
        if(this.sprite.counter >= interval){
            this.sprite.counter = 0;
            this.sprite.column++;
            if(this.sprite.column === 3) this.sprite.column = 0;
        }
        ctx.drawImage(this.sprite.image, this.width*this.sprite.column, this.height*this.sprite.row, this.width, this.height, this.x + this.gameMap.x, this.y + this.gameMap.y, this.width, this.height);
    }
    update(){
        // horizontal speed (walking)
        if(controller.buttons.leftPressed){
            this.speedX = -this.walkSpeed;
            this.sprite.row = 3
        }else
        if(controller.buttons.rightPressed){
            this.speedX = this.walkSpeed;
            this.sprite.row = 1
        }else{
            this.speedX = 0;
            this.sprite.row = this.sprite.row > 1 ? 2 : 0;
        }

        // move player horizontally
        if(this.x + this.speedX >= 0 && this.x + this.width + this.speedX <= this.gameMap.width){
            this.x += this.speedX;
        }

        // move map horizontally
        this.gameMap.x = ((canvas.width - this.width) / 2) - this.x;
        if(this.gameMap.x > 0){
            this.gameMap.x = 0;
        }
        if(this.gameMap.x + this.gameMap.width < canvas.width){
            this.gameMap.x = canvas.width - this.gameMap.width;
        }

        // determine floor
        this.floor = this.getFloor();

        // walking off a platform = inMidAir
        if(this.y + this.height < this.floor.y){
            this.inMidAir = true;
        }

        // pressing spacebar to jump = inMidAir
        if(!this.inMidAir && controller.buttons.spacebarPressed){
            this.speedY = this.jumpSpeed;
            this.inMidAir = true;
        }

        // while inMidAir
        if(this.inMidAir){
            this.speedY -= this.gravity;

            if(this.y + this.height - this.speedY >= this.floor.y){
                this.y = this.floor.y - this.height;
                this.inMidAir = false;
                this.speedY = 0;
            }else{
                this.y -= this.speedY;
            }
        }
    }
}


class GameMap {
    x = 0;
    y = 0;
    height = canvas.height;
    width = 2000;
    image;

    constructor(){
        this.image = new Image();
        this.image.src = "../images/jungle.jpg"
    }

    draw(){
        ctx.drawImage(
            this.image,
            0, 0, this.width, this.height,
            this.x, this.y, this.width, this.height
        );
    }
}



/*
Super Jungle Man

Larry the Jungle Man is on a quest to get to the other side of the jungle where he has better signal.
He can walk, run, jump, climb, and swing
He tries to collect as many coconuts as he can
When he gets hit by thorns and bugs, his patience drops
If his patience drops to 0, he gives up.
Then he mopes and does relaxing puzzles on his phone until he calms down.
After which you can continue to the level.

*/

/*

Player
    - walk
    - run
    - jump
    - sprite animations
Platforms
Scroll
Collisio Detection utility
Climbing
Coconuts
Player stats overlay (patience meter, coconut count, time left)


*/

const gameScreen = new GameScreen();

export { gameScreen }