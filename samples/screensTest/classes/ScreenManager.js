import { fadeOverlay } from "./FadeOverlay.js";
import { gameSelectScreen } from "./GameSelectScreen.js";
import { optionsScreen } from "./OptionsScreen.js";
import { titleScreen } from "./TitleScreen.js";

class ScreenManager {
    #currentScreen = titleScreen;
    #screens = {
        TITLE: titleScreen,
        GAME_SELECT: gameSelectScreen,
        OPTIONS: optionsScreen
    }

    get currentScreen(){
        return this.#currentScreen;
    }

    screens = {
        TITLE: "TITLE",
        GAME_SELECT: "GAME_SELECT",
        OPTIONS: "OPTIONS"
    }

    init(){
        this.#currentScreen.activate?.();
        fadeOverlay.fromBlack();
    }

    cutTo(screen){
        const nextScreen = this.#screens[screen];
        if(this.#currentScreen !== nextScreen){
            this.#currentScreen = nextScreen;
            this.#currentScreen.activate?.();
        }
    }
    fadeTo(screen){
        const nextScreen = this.#screens[screen];
        if(this.#currentScreen !== nextScreen){
            fadeOverlay.toBlack(() => {
                this.#currentScreen = nextScreen;
                this.#currentScreen.activate?.();
                fadeOverlay.fromBlack();
            })
        }
    }
}

const screenManager = new ScreenManager();

export { screenManager }