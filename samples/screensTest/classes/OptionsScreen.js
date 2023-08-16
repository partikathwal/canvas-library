import { cycleBetween } from "../utils.js";
import { controller } from "./GameController.js";
import { gameSound } from "./GameSound.js";
import { screenManager } from "./ScreenManager.js";
import { canvas, ctx } from "./canvas.js";

class OptionsScreen {
    constructor(){
        this.image = new Image();
        this.image.src = "../images/forest2.jpg";

        this.highlightedChoiceIndex = 0;
        this.brightnessPulse = 0;
    }
    activate(){
        controller.setMapping({
            up: this.moveSelectionUp.bind(this),
            down: this.moveSelectionDown.bind(this),
            left: this.adjustSettingLeft.bind(this),
            right: this.adjustSettingRight.bind(this),
            spacebar: this.select.bind(this)
        })
    }
    moveSelectionDown(){
        if(this.highlightedChoiceIndex < 4){
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
    adjustSettingLeft(){
        if(this.highlightedChoiceIndex !== 4){
            gameSound.playSound(gameSound.sounds.OPTION);
        }

        switch(this.highlightedChoiceIndex){
            case 0:
                gameSound.toggleMusic();
                break;
            case 1:
                gameSound.musicVolumeDown();
                break;
            case 2:
                gameSound.toggleSound();
                break;
            case 3:
                gameSound.soundVolumeDown();
                break;
            default:
                break;
        }
    }
    adjustSettingRight(){
        if(this.highlightedChoiceIndex !== 4){
            gameSound.playSound(gameSound.sounds.OPTION);
        }

        switch(this.highlightedChoiceIndex){
            case 0:
                gameSound.toggleMusic()
                break;
            case 1:
                gameSound.musicVolumeUp();
                break;
            case 2:
                gameSound.toggleSound();
                break;
            case 3:
                gameSound.soundVolumeUp();
                break;
            default:
                break;
        }
    }
    select(){
        if(this.highlightedChoiceIndex === 4){
            gameSound.playSound(gameSound.sounds.BACK);
            screenManager.cutTo(screenManager.screens.GAME_SELECT);
        }
    }
    draw(){
        // image
        ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);

        // settings
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "40px TiltPrism";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 7;
        ctx.strokeStyle = "white";

        const choices = [
            `Music ${ gameSound.musicOn ? "ON" : "OFF" }`,
            `Music Volume ${ gameSound.musicVolume }`,
            `SFX ${ gameSound.sfxOn ? "ON" : "OFF" }`,
            `SFX Volume = ${gameSound.sfxVolume}`,
            `Go Back`
        ]

        for(let i = 0; i < choices.length; i++){
            if(this.highlightedChoiceIndex === i){
                const brightness = cycleBetween(this.brightnessPulse, 155, 255, 2);
                ctx.shadowColor = `rgb(0,${brightness},0)`;
            }else{
                ctx.shadowColor = "black";
            }
            
            ctx.strokeText(choices[i], canvas.width / 2, (i+2) * canvas.height / 7);
        }
    }
    update(){
        this.brightnessPulse++;        
    }
}

const optionsScreen = new OptionsScreen();

export { optionsScreen }