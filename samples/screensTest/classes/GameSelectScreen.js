import { cycleBetween } from "../utils.js";
import { controller } from "./GameController.js";
import { gameSound } from "./GameSound.js";
import { screenManager } from "./ScreenManager.js";
import { canvas, ctx } from "./canvas.js";



class GameSelectScreen {
    constructor(){
        this.image = new Image();
        this.image.src = "../images/forest2.jpg";

        this.choices = ["New Game", "Continue", "Options"]
        this.highlightedChoiceIndex = 0;
        this.brightnessPulse = 0;
        this.selectionMade = false;
    }
    activate(){
        this.selectionMade = false;

        gameSound.playMusic(gameSound.music.JURASSIC);

        controller.setMapping({
            up: this.moveSelectionUp.bind(this),
            down: this.moveSelectionDown.bind(this),
            spacebar: this.select.bind(this)
        })
    }
    moveSelectionDown(){
        if(this.highlightedChoiceIndex < this.choices.length - 1){
            this.highlightedChoiceIndex++;
            gameSound.playSound(gameSound.sounds.OPTION);
        }
    }
    moveSelectionUp(){
        if(this.highlightedChoiceIndex > 0){
            this.highlightedChoiceIndex--;
            gameSound.playSound(gameSound.sounds.OPTION);
        }
    }
    select(){
        this.selectionMade = true;

        if(this.highlightedChoiceIndex === 0){
            gameSound.stopMusic();
            gameSound.playSound(gameSound.sounds.MENU_SELECT);
            setTimeout(() => {
                // fade to new game screen
            }, 300);
        }else
        if(this.highlightedChoiceIndex === 1){
            gameSound.stopMusic();
            gameSound.playSound(gameSound.sounds.MENU_SELECT);
            
            setTimeout(() => {
                // fade to continue game screen
            }, 300)
        }else
        if(this.highlightedChoiceIndex === 2){
            gameSound.playSound(gameSound.sounds.CHOOSE);
            screenManager.cutTo(screenManager.screens.OPTIONS);
        }
    }
    draw(){
        // image
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);

        // choices
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "40px TiltPrism";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;
        for(let i = 0; i < this.choices.length; i++){
            if(this.highlightedChoiceIndex === i){
                if(this.selectionMade && this.highlightedChoiceIndex < 2){
                    const brightness = cycleBetween(this.brightnessPulse, 0, 255, 50);
                    ctx.shadowColor = `rgb(255,${brightness},0)`;
                }else{
                    const brightness = cycleBetween(this.brightnessPulse, 155, 255, 2);
                    ctx.shadowColor = `rgb(0,${brightness},0)`;
                }
            }else{
                ctx.shadowColor = "black";
            }
            ctx.strokeText(this.choices[i], canvas.width / 2, (i+2) * canvas.height / 6);
        }
        ctx.shadowColor = "black";
        ctx.shadowBlur = 0;
    }
    update(){
        this.brightnessPulse++;
    }
}

const gameSelectScreen = new GameSelectScreen();

export { gameSelectScreen }