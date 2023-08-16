import { fadeOverlay } from "./classes/FadeOverlay.js";
import { controller } from "./classes/GameController.js";
import { screenManager } from "./classes/ScreenManager.js";
import { canvas, ctx } from "./classes/canvas.js";

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    screenManager.currentScreen.draw();
    screenManager.currentScreen.update();

    fadeOverlay.draw();

    requestAnimationFrame(animate);
}

async function init(){

    const font = new FontFace("TiltPrism", "url(../fonts/TiltPrism-Regular.ttf)");
    await font.load()
    document.fonts.add(font);
    
    controller.init();
    screenManager.init();
    animate();
}

document.getElementById("start").addEventListener("click", function(){
    this.remove();
    init();
})