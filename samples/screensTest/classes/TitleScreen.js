import { cycleBetween } from "../utils.js";
import { controller } from "./GameController.js";
import { gameSound } from "./GameSound.js";
import { screenManager } from "./ScreenManager.js";
import { canvas, ctx } from "./canvas.js";

class TitleScreen {
    constructor(){
        // image
        this.image = new Image();
        this.image.src = "../images/forest.png";

        // title
        this.title = "Super Jungle Man"
        this.startTextBrightness = 0;
        this.pressedStart = false;
    }
    activate(){
        this.pressedStart = false;
        this.startTextBrightness = 0;
        
        controller.setMapping({
            spacebar: this.pressStart.bind(this)
        });

        gameSound.playMusic(gameSound.music.BGM);
    }
    pressStart(){
        this.pressedStart = true;
        
        gameSound.stopMusic();
        gameSound.playSound(gameSound.sounds.MENU_SELECT);

        setTimeout(() => {
            screenManager.fadeTo(screenManager.screens.GAME_SELECT);
        }, 300);
    }
    draw(){
        // image
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);

        // title
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "60px TiltPrism";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;
        ctx.strokeStyle = "white";
        ctx.strokeText(this.title, canvas.width / 2, canvas.height / 3)

        // press start
        if(this.pressedStart){
            const brightness = cycleBetween(this.startTextBrightness, 0, 255, 50);
            ctx.shadowColor = `rgb(255, ${brightness}, 0)`;
        }else{
            const brightness = cycleBetween(this.startTextBrightness, 0, 255, 5);
            ctx.shadowColor = `rgb(0, ${brightness}, 0)`;
        }
        ctx.font = "30px TiltPrism";
        ctx.strokeText("Press Start", canvas.width / 2, canvas.height * 2 / 3)
        ctx.shadowColor = "black";
        ctx.shadowBlur = 0;
    }
    update(){
        this.startTextBrightness++;
    }
}

const titleScreen = new TitleScreen();

export { titleScreen }