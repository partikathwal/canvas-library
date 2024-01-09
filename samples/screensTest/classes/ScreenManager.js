import { CONFIG } from "../config.js";
import { fadeOverlay } from "./FadeOverlay.js";
import { gameScreen } from "./GameScreen.js";
import { gameSelectScreen } from "./GameSelectScreen.js";
import { layoutsTestScreen } from "./LayoutsTestScreen.js";
import { optionsScreen } from "./OptionsScreen.js";
import { titleScreen } from "./TitleScreen.js";

class ScreenManager {
    #screens = {
        TITLE: titleScreen,
        GAME_SELECT: gameSelectScreen,
        OPTIONS: optionsScreen,
        GAME: gameScreen,
        LAYOUT: layoutsTestScreen
    }

    #currentScreen = this.#screens[CONFIG.startingScreen];

    get currentScreen(){
        return this.#currentScreen;
    }

    screens = {
        TITLE: "TITLE",
        GAME_SELECT: "GAME_SELECT",
        OPTIONS: "OPTIONS",
        GAME: "GAME"
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