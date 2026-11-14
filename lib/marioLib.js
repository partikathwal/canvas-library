import { Keyboard, Sprite2, Shape } from "./lib.js";

export class Mario extends Sprite2 {

    speedX = 0;
    accelerationX = 0.1;
    maxSpeed = 10;
    
    inAir = false;
    ground = 300;
    speedY = 0;
    accelerationY = .7;
    jumpSpeed = 10;
    jumpHold = .5;
    holdBlocked = false;

    constructor(){
        super('./test files/characters.png', {
            x: 100,
            y: 300,
            w: 16,
            h: 32,
            scale: 2,
            cycles: {
                standingLeft: [{x: 239, y: 1}],
                standingRight: [{x: 258, y: 1}],
                crouchingLeft: [{x: 224, y: 1}],
                crouchingRight: [{x: 272, y: 1}],
                walkingLeft: [
                    {x: 201, y: 1},
                    {x: 184, y: 1},
                    {x: 166, y: 1},
                    {x: 184, y: 1},
                ],
                walkingRight: [
                    {x: 296, y: 1},
                    {x: 314, y: 1},
                    {x: 331, y: 1},
                    {x: 314, y: 1},
                ],
                jumpingLeft: [
                    {x: 128, y: 1},
                ],
                jumpingRight: [
                    {x: 369, y: 1},
                ],
            },
        });

        this.setCycle(this.cycles.standingRight);
        this.direction = 1;
    }

    update(){
        super.update(this.speedX / 3);

        if(Keyboard.isPressed('Space')){
            if(!this.inAir){
                const jumpCycle = this.direction === 1 ? this.cycles.jumpingRight : this.cycles.jumpingLeft;
                this.setCycle(jumpCycle);
                
                this.speedY = this.jumpSpeed;
                this.inAir = true;
                this.holdBlocked = false;
            }
        }else{
            this.holdBlocked = true;
        }

        if(this.inAir){
            const jumpHold = this.holdBlocked ? 1 : this.jumpHold
            this.speedY -= (this.accelerationY * jumpHold)
            this.y -= this.speedY;
            if(this.y >= this.ground){
                this.y = this.ground;
                this.inAir = false;
            }
        }

        // TODO: mario turns around too quick
        if(Keyboard.isPressed('ArrowLeft')){
            if(!this.inAir) this.setCycle(this.cycles.walkingLeft)
            this.direction = -1;

            if(Math.abs(this.speedX) < this.maxSpeed) this.speedX += this.accelerationX;
            this.x += this.speedX * this.direction;
        }else
        if(Keyboard.isPressed('ArrowRight')){
            if(!this.inAir) this.setCycle(this.cycles.walkingRight)
            this.direction = 1;

            if(Math.abs(this.speedX) < this.maxSpeed) this.speedX += this.accelerationX;
            this.x += this.speedX * this.direction;
        }else{
            if(Math.abs(this.speedX) > 0.1){
                this.speedX *= 0.9;
                this.x += this.speedX * this.direction

                if(!this.inAir){
                    const cycle = this.direction === 1 ? this.cycles.walkingRight : this.cycles.walkingLeft;
                    this.setCycle(cycle);
                }
            }else{
                this.speedX = 0;

                if(!this.inAir){
                    const cycle = this.direction === 1 ? this.cycles.standingRight : this.cycles.standingLeft;
                    this.setCycle(cycle);
                }
            }
        }
    }

    draw(context){
        super.draw(context);
    }
}