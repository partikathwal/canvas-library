import { Canvas, Controller } from "./lib.js";

const canvas = new Canvas({width: 300, height: 300});
const { context } = canvas;

const box = {
    x: 0,
    y: 0,
    w: 50,
    h: 50,
    speed: 2,
}



canvas.animate(() => {
    // update
    if(Controller.isPressed.left){box.x -= box.speed; console.log(box.x)}
    if(Controller.isPressed.right) box.x += box.speed;
    if(Controller.isPressed.up) box.y -= box.speed;
    if(Controller.isPressed.down) box.y += box.speed;

    // draw
    context.fillRect(box.x, box.y, box.w, box.h);
})