import { Box, Game, Keyboard, Screen } from "./lib.js";

const screen1 = new Screen((screen) => {
    const box = new Box({ x: 100, y: 100, w: 20, h: 20});

    function update(){
        if(Keyboard.isPressed('ArrowLeft')) box.x--;
        if(Keyboard.isPressed('ArrowRight')) box.x++;
        if(Keyboard.isPressed('ArrowUp')) box.y--;
        if(Keyboard.isPressed('ArrowDown')) box.y++;

        if(box.x > screen.game.canvas.width){
            screen.navigate(screen2);
        }
    }

    function draw(context){
        box.draw(context);
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