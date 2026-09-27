/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// fixed dimensions
canvas.width = 1280;
canvas.height = 720;

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // stuff that needs to happen on every render
    player.update();
    player.draw();

    requestAnimationFrame(animate)
}

window.addEventListener('gamepadconnected', (ev) => {
    animate();
})

//====================

class Player {
    x = 50
    y = 200
    w = 50
    h = 50

    speedX = 0;
    speedY = 0;
    
    maxSpeed = 10;

    draw(){
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    update(){
        if(Controller.joystick.x !== 0){
            // user input increases speed
            this.speedX += Controller.joystick.x;

            // but not infinitely
            if(this.speedX > this.maxSpeed) this.speedX = this.maxSpeed;
            if(this.speedX < -this.maxSpeed) this.speedX = -this.maxSpeed;
        }else{
            //no user input allows friction to naturally slow it down
            this.speedX /= 1.1;

            // eventually round it to zero
            if(Math.abs(this.speedX) < 0.1) this.speedX = 0;
        }


        // update position based on current speed
        this.x += this.speedX;
    }
}

const player = new Player();

class Controller {
    static joystick = {
        get x(){
            const gamepad = navigator.getGamepads()[0];
            const x = gamepad.axes[0];
            return (Math.abs(x) < 0.2) ? 0 : x;
        },
        // get y(){
        //     const gamepad = navigator.getGamepads()[0];
        //     const y = gamepad.axes[1];
        //     return (Math.abs(y) < 0.1) ? 0 : y;
        // }
    }
}

//==========
function roundAxes(value){
    if(value > -0.1 && value < 0.1) return 0;
    return value;
}