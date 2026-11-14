import { Box, Game, Keyboard, Line, Point, Screen } from "./lib.js";
import { Mario } from "./marioLib.js";

const screen1 = new Screen((screen) => {

    const mario = new Mario();
    const floor = new Line(new Point(0, 364), new Point(screen.game.canvas.width, 364));

    function update(){

        if(mario.x > screen.game.canvas.width){
            screen.navigate(screen2);
        }

        mario.update();
    }

    function draw(context){
        mario.draw(context);
        floor.draw(context);
    }

    return { update, draw }
})

const screen2 = new Screen((screen) => {
    const bigBox = new Box({ x: 200, y: 200, w: 50, h: 50 });

    function update(){
        if(Keyboard.isPressed('ArrowLeft')) bigBox.x -= 2;
        if(Keyboard.isPressed('ArrowRight')) bigBox.x += 2;
        if(Keyboard.isPressed('ArrowUp')) bigBox.y -= 2;
        if(Keyboard.isPressed('ArrowDown')) bigBox.y += 2;

        if(bigBox.x < 0){
            screen.navigate(screen1);
        }
    }

    function draw(context){
        bigBox.draw(context);
    }

    return { update, draw }
})

const screens = [screen1, screen2];

const game = new Game(screens);
game.start()