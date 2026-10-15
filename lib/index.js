import { Ball, Box, Canvas, ImageBox, Keyboard, Paddle } from "./lib.js";

const canvas = new Canvas();
const { context } = canvas;

const background = new ImageBox({ x: 0, y: 0, w: canvas.width, h: canvas.height, imagePath: './test files/nemo.png', blur: true})

const paddleA = new Paddle({ w: 20, h: 100, x: 20, y: (canvas.height/2 - 100), speedY: 2 });
const paddleB = new Paddle({ w: 20, h: 100, x: (canvas.width - 20 - 20), y: (canvas.height/2 - 100), speedY: 2 });
const ball = new Ball({ centerX: canvas.width/2, centerY: canvas.height/2 });
const ceiling = new Box({x: 0, y: -10, w: canvas.width, h: 10 })
const floor = new Box({x: 0, y: canvas.height, w: canvas.width, h: 10 })

const score = {
    left: 0,
    right: 0,
}

// TODO: I'd like some steeper angles depending on the hit
// I'll need to think of the physics of that
// This'll be after the paddle acceleration task
// The paddle's speed should affect the ball speed
// Also the angle somehow
// Game idea: Add more controls to ROTATE the paddles???
    // Left and right can pivot them a bit

canvas.animate(() => {
    // update
    if(Keyboard.isPressed('w') && (paddleA.top - paddleA.speedY) >= 0){
        paddleA.moveUp();
        if(Keyboard.isPressed('a')) paddleA.moveUp();
    }

    if(Keyboard.isPressed('s') && (paddleA.bottom + paddleA.speedY) <= canvas.bottom){
        paddleA.moveDown()
        if(Keyboard.isPressed('a')) paddleA.moveDown();
    }

    if(Keyboard.isPressed('ArrowUp') && (paddleB.top - paddleB.speedY) >= 0){
        paddleB.moveUp()
        if(Keyboard.isPressed('Shift')) paddleB.moveUp();
    }
    if(Keyboard.isPressed('ArrowDown') && (paddleB.bottom + paddleB.speedY) <= canvas.bottom){
        paddleB.moveDown()
        if(Keyboard.isPressed('Shift')) paddleB.moveDown();
    }

    // ball/paddle collision detection
    if(ball.overlapsWith(paddleA, ball.speedX, ball.speedY) || ball.overlapsWith(paddleB, ball.speedX, ball.speedY)){
        ball.speedX = ball.speedX * -1.05; // flip it
        
        // which paddle?
        const paddle = ball.x < canvas.width/2 ? paddleA : paddleB;

        
        // where on the paddle?
        const range = (ball.y - paddle.y) / paddle.h // 0 to 1
        const range2 = range - 0.5; // -0.5 to 0.5
        
        // is the paddle moving?
        // if(ball.speedY){ // Hmm this is constant though, so always true

        // }

        const returnAngle = (range2 * Math.PI) // -45deg to 45deg

        ball.speedY = Math.sin(returnAngle) * 1.05;

        // adjust speedY
    }

    // ball/ceiling collision detection
    if(ball.overlapsWith(ceiling, ball.speedX, ball.speedY) || ball.overlapsWith(floor, ball.speedX, ball.speedY)){
        ball.speedY = ball.speedY * -1.05;
    }

    // ball/ceiling collision detection (game win/lose)
    if(ball.x + ball.radius < 0){
        // right paddle wins
        score.right++;
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        ball.resetTrajectory('right')
    }else
    if(ball.x - ball.radius >= canvas.width){
        // left paddle wins
        score.left++;
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        ball.resetTrajectory('left')
    }

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // draw
    background.draw(context)

    paddleA.draw(context, true);
    paddleB.draw(context);

    ball.draw(context);

    context.font = "12px Arial"
    context.fillText(score.left, 10, 10);
    context.fillText(score.right, canvas.right - 22, 10);
})