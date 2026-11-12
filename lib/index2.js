import { Box, Game, Keyboard, Screen, Sprite } from "./lib.js";

const screen1 = new Screen((screen) => {

    const sprite = new Sprite('./test files/characters.png', {
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

    sprite.setCycle('standingRight');


    function update(){
        if(Keyboard.isPressed('ArrowLeft')){
            sprite.direction = -1;
            sprite.activeState = sprite.states.WALKING;
            if(sprite.currentCycle !== 'walkingLeft'){
                sprite.setCycle('walkingLeft')
            }
        }else
        if(Keyboard.isPressed('ArrowRight')){
            sprite.direction = 1;
            sprite.activeState = sprite.states.WALKING;
            if(sprite.currentCycle !== 'walkingRight'){
                sprite.setCycle('walkingRight')
            }
        }else{
            sprite.activeState = sprite.states.STANDING;
            if(sprite.direction === 1 && sprite.currentCycle !== 'standingRight' && sprite.speedX === 0){
                sprite.setCycle('standingRight');
            }else
            if(sprite.direction === -1 && sprite.currentCycle !== 'standingLeft' && sprite.speedX === 0){
                sprite.setCycle('standingLeft');
            }
        }

        if(sprite.x > screen.game.canvas.width){
            screen.navigate(screen2);
        }

        sprite.update();
    }

    function draw(context){
        sprite.draw(context);
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