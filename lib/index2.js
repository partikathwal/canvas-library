import { Box, Game, Keyboard, Screen } from "./lib.js";

const screen1 = new Screen((screen) => {
    const box = new Box({ x: 100, y: 100, w: 20, h: 20});

    function update(){
        if(Keyboard.isPressed('ArrowLeft')) box.x--;
        if(Keyboard.isPressed('ArrowRight')) box.x++;
        if(Keyboard.isPressed('ArrowUp')) box.y--;
        if(Keyboard.isPressed('ArrowDown')) box.y++;
    }

    function draw(context){
        box.draw(context);
    }

    return { update, draw }
})

const screens = [screen1];

const game = new Game(screens);
game.start()