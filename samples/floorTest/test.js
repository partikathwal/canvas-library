/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

class Controller {
    right = false;
    left = false;
    up = false;
    down = false;
    spacebar = false;

    constructor(){
        //start listening for input
        document.addEventListener("keydown", (e) => {
            if(e.key === "ArrowUp") this.up = true;
            if(e.key === "ArrowLeft") this.left = true;
            if(e.key === "ArrowRight") this.right = true;
            if(e.key === "ArrowDown ") this.down = true;
            if(e.key === " ") this.spacebar = true;
        });

        document.addEventListener("keyup", (e) => {
            if(e.key === "ArrowUp") this.up = false;
            if(e.key === "ArrowLeft") this.left = false;
            if(e.key === "ArrowRight") this.right = false;
            if(e.key === "ArrowDown ") this.down = false;
            if(e.key === " ") this.spacebar = false;
        })
    }
}


class Floor {
    constructor(x, y, width, y2){
        this.x = x;
        this.y = y;
        this.width = width;
        this.y2 = y2;
    }

    draw(){
        c.fillStyle = "#111";
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x + this.width, this.y2 || this.y);
        c.stroke();
    }

    getElevation(absoluteX){
        if(!this.y2) return this.y;

        const m = (this.y2 - this.y) / this.width;
        const b = this.y;
        const x = absoluteX - this.x;
        return parseInt((m * x) + b);
    }
}

const floors = [
    new Floor(0, 500, 400),
    new Floor(400, 500, 200, 300),
    new Floor(600, 300, 200),
];

class Player {
    x = 100;
    y = 0;
    w = 50;
    h = 50;
    dy = 0;
    dx = 5;
    jumpVelocity = 20;
    grounded = false;
    floor = floors[0];

    update(){
        if(!this.grounded){
            // if next increment would make the bottom pass the floor
            if((this.y + this.h) - this.dy >= this.floor.getElevation(this.x)){
                // land
                this.grounded = true;
                this.y = this.floor.getElevation(this.x) - this.h;
                this.dy = 0;
            }else{
                // fall
                this.y -= this.dy; //apply speed
                this.dy--; //acceleration
                this.updateFloor();
            }
        }

        if(controller.right){
            this.x += this.dx;
            this.updateFloor();
            if(this.grounded) this.y = this.floor.getElevation(this.x) - this.h;

        }
        if(controller.left){
            this.x -= this.dx;
            this.updateFloor();
            if(this.grounded) this.y = this.floor.getElevation(this.x) - this.h;
        }
        if(controller.up){
            this.jump();
        }
    }

    draw(){
        c.fillStyle = "blue";
        c.fillRect(this.x, this.y, this.w, this.h);
    }

    jump(){
        if(!this.grounded) return;
        this.grounded = false;
        this.dy = this.jumpVelocity;
    }

    updateFloor(){
        this.floor = floors
            .filter((floor) => {
                return (
                    floor.x <= (this.x + this.w) &&         // within left boundary
                    (floor.x + floor.width) >= this.x &&    // within right boundary
                    floor.y >= (this.y + this.h)            // underneath player
                );
            }).sort((a,b) => a.y - b.y)[0];
        
        if((this.y + this.h) < this.floor.y) this.grounded = false;
    }
}

const player = new Player();
const controller = new Controller();

function animate(){

    //draw everything
    c.clearRect(0, 0, canvas.width, canvas.height);
    floors.forEach((f) => f.draw());
    player.update();
    player.draw();
    requestAnimationFrame(animate);
}

animate();