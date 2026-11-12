import { Box, Game, Keyboard, Screen, Sprite } from "./lib.js";

const screen1 = new Screen((screen) => {
    const boxq = new Box({ x: 100, y: 100, w: 20, h: 20});

    const box = new Sprite('./test files/characters.png', {
        x: 100,
        y: 100,
        w: 50,
        h: 100,
        frame: {w: 16, h: 32},
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
                {x: 352, y: 1},
            ],
            jumpingRight: [
                {x: 144, y: 1},
            ],
        }
    });
    box.setCycle('standingRight');

    function update(){
        // if(Keyboard.isPressed('ArrowLeft')) box.x--;
        // if(Keyboard.isPressed('ArrowRight')) box.x++;
        // if(Keyboard.isPressed('ArrowUp')) box.y--;
        // if(Keyboard.isPressed('ArrowDown')) box.y++;

        if(Keyboard.isPressed('ArrowLeft')){
            box.direction = -1;
            box.activeState = box.states.WALKING;
            if(box.getCurrentCycle() !== 'walkingLeft'){
                box.setCycle('walkingLeft')
            }
        }else
        if(Keyboard.isPressed('ArrowRight')){
            box.direction = 1;
            box.activeState = box.states.WALKING;
            if(box.getCurrentCycle() !== 'walkingRight'){
                box.setCycle('walkingRight')
            }
        }else{
            box.activeState = box.states.STANDING;
            console.log(box.speedX);
            if(box.direction === 1 && box.getCurrentCycle() !== 'standingRight' && box.speedX === 0){
                box.setCycle('standingRight');
            }else
            if(box.direction === -1 && box.getCurrentCycle() !== 'standingLeft' && box.speedX === 0){
                box.setCycle('standingLeft');
            }
        }
        
        // if(Keyboard.isPressed('ArrowLeft')){
        //     if(box.getCurrentCycle() !== 'walkingLeft'){
        //         box.setCycle('walkingLeft');
        //         box.direction = -1;
        //     }
        //     box.accelerationX = -0.5
        // }else
        // if(Keyboard.isPressed('ArrowRight')){
        //     if(box.getCurrentCycle() !== 'walkingRight'){
        //         box.setCycle('walkingRight');
        //         box.direction = 1;
        //     }
        //     box.accelerationX = 0.5
        // }else{
        //     box.accelerationX = 0;
        //     if(box.speedX === 0){
        //         if(box.direction === 1){
        //             box.setCycle('standingRight');
        //         }else{
        //             box.setCycle('standingLeft');
        //         }
        //     }
        // }

        if(box.x > screen.game.canvas.width){
            screen.navigate(screen2);
        }

        box.update();

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