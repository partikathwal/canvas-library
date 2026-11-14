import { Keyboard, Shape, Sprite } from "./lib.js";

export class Mario {

    sprite = null;
    shape = null;

    // acceleration is always positive, and can be combined with direction
    // speed can be positive or negative
    // direction is which way mario is trying to go aka facing
    speedX = 0;
    accelerationX = 0.1;
    decelerationFactor = 0.9;
    maxSpeed = 10;
    minSpeed = 0.1;

    direction = 1;
    
    inAir = false;
    ground = 300;
    speedY = 0;
    accelerationY = .7;
    initialJumpSpeed = 10;
    jumpHoldFactor = .5;
    jumpHoldBlocked = false;

    crouching = false;

    constructor(){
        this.shape = new Shape({ x: 100, y: 300, w: 32, h: 64 });
        this.sprite = new Sprite('./test files/characters.png', {
            frameWidth: 16,
            frameHeight: 32,
            cycles: {
                standingLeft: [{x: 239, y: 1}],
                standingRight: [{x: 258, y: 1}],
                crouchingLeft: [{x: 220, y: 1}],
                crouchingRight: [{x: 277, y: 1}],
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
                jumpingLeft: [{x: 128, y: 1}],
                jumpingRight: [{x: 369, y: 1}],
                haltingLeft: [{x: 147, y: 1}],
                haltingRight: [{x: 350, y: 1}],
            },
        });
    }

    get belowMaxSpeed(){ return Math.abs(this.speedX) < this.maxSpeed }
    get aboveMinSpeed(){ return Math.abs(this.speedX) > this.minSpeed }

    get movingHorizontally(){ return Math.abs(this.speedX) > 0 }
    get halting(){ return (this.direction < 0 && this.speedX > 0) || (this. direction > 0 && this.speedX < 0) }

    get standingCycle(){ return this.direction === 1 ? this.sprite.cycles.standingRight : this.sprite.cycles.standingLeft; }
    get walkingCycle(){ return this.direction === 1 ? this.sprite.cycles.walkingRight : this.sprite.cycles.walkingLeft; }
    get jumpingCycle(){ return this.direction === 1 ? this.sprite.cycles.jumpingRight : this.sprite.cycles.jumpingLeft; }
    get crouchingCycle(){ return this.direction === 1 ? this.sprite.cycles.crouchingRight : this.sprite.cycles.crouchingLeft; }
    get haltingCycle(){ return this.direction === 1 ? this.sprite.cycles.haltingRight : this.sprite.cycles.haltingLeft; }


    walk(direction){
        this.direction = direction;
        this.speedUpHorizontally()
    }

    moveHorizontally(){
        this.shape.x += this.speedX;
    }

    speedUpHorizontally(){
        if(this.belowMaxSpeed){
            this.speedX += (this.accelerationX * this.direction * (this.halting ? 3 : 1));
            if(!this.belowMaxSpeed) this.speedX = this.maxSpeed * this.direction;
        }
    }

    slowDownHorizontally(){
        if(this.aboveMinSpeed){
            this.speedX *= this.decelerationFactor;
        }else{
            this.speedX = 0;
        }
    }


    jump(){
        if(!this.inAir){
            this.inAir = true;
            this.jumpHoldBlocked = false;
            this.speedY = this.initialJumpSpeed;
        }
    }

    moveVertically(){
        if(this.inAir){
            const jumpHoldFactor = this.jumpHoldBlocked ? 1 : this.jumpHoldFactor
            this.speedY -= (this.accelerationY * jumpHoldFactor)
            this.shape.y -= this.speedY;
            if(this.shape.y >= this.ground){
                this.shape.y = this.ground;
                this.inAir = false;
            }
        }
    }
    

    update(){
        if(Keyboard.isPressed('ArrowLeft') && !this.crouching){
            this.walk(-1);
        }else
        if(Keyboard.isPressed('ArrowRight') && !this.crouching){
            this.walk(1);
        }else{
            this.slowDownHorizontally();
        }

        if(Keyboard.isPressed('Space')){
            this.jump();
        }else{
            this.jumpHoldBlocked = true;
        }

        if(Keyboard.isPressed('ArrowDown') && !this.inAir){
            this.crouching = true;
        }else{
            this.crouching = false;
        }

        if(this.inAir){
            this.sprite.setCycle(this.jumpingCycle);
        }else
        if(this.movingHorizontally){
            if(this.halting){
                this.sprite.setCycle(this.haltingCycle);
            }else
            if(this.crouching){
                this.sprite.setCycle(this.crouchingCycle);
            }else{
                this.sprite.setCycle(this.walkingCycle);
            }
        }else{
            if(this.crouching){
                this.sprite.setCycle(this.crouchingCycle);
            }else{
                this.sprite.setCycle(this.standingCycle);
            }
        }

        this.moveHorizontally();
        this.moveVertically();

        this.sprite.update(Math.abs(this.speedX) / 3);
    }

    draw(context){
        this.sprite.draw(context, this.shape);
    }
}