class GameSound {
    #musicOn = true;
    #musicVolume = 100;
    #sfxOn = true;
    #sfxVolume = 100;

    get musicOn(){ return this.#musicOn }
    get musicVolume(){ return this.#musicVolume }
    get sfxOn(){ return this.#sfxOn }
    get sfxVolume(){ return this.#sfxVolume }

    #music = {
        BGM: new Audio("../audio/jumble.mp3"),
        JURASSIC: new Audio("../audio/jurassic park.mp3"),
    }

    #sounds = {
        MENU_SELECT: new Audio("../audio/menu select.mp3"),
        OPTION: new Audio("../audio/option.mp3"),
        CHOOSE: new Audio("../audio/choose.mp3"),
        BACK: new Audio("../audio/back.mp3")
    }

    #currentMusic = null;

    music = {
        BGM: "BGM",
        JURASSIC: "JURASSIC"
    }
    
    sounds = {
        MENU_SELECT: "MENU_SELECT",
        OPTION: "OPTION",
        CHOOSE: "CHOOSE",
        BACK: "BACK"
    }

    toggleMusic(){
        this.#musicOn ? this.turnMusicOff() : this.turnMusicOn();
    }
    turnMusicOn(){
        this.#musicOn = true;
        this.playMusic();
    }
    turnMusicOff(){
        this.#musicOn = false;
        this.stopMusic();
    }

    
    playMusic(trackKey){
        if(trackKey){
            const music = this.#music[trackKey];
            if(music === this.#currentMusic && !this.#currentMusic.paused){
                return;
            }
            this.#currentMusic = music;
        }

        if(this.#currentMusic && this.#musicOn){
            this.#currentMusic.loop = true; //https://stackoverflow.com/questions/46926033/create-seamless-loop-of-audio-web
            this.#currentMusic.volume = this.#musicVolume / 100;
            this.#currentMusic.currentTime = 0;
            this.#currentMusic.play();
        }
    }
    stopMusic(){
        this.#currentMusic?.pause();
    }
    musicVolumeUp(){
        if(this.#musicVolume < 100){
            this.#musicVolume++;
            if(this.#currentMusic){
                this.#currentMusic.volume = this.#musicVolume / 100
            }
        }
    }
    musicVolumeDown(){
        if(this.#musicVolume > 0){
            this.#musicVolume--;
            if(this.#currentMusic){
                this.#currentMusic.volume = this.#musicVolume / 100
            }
        }
    }

    toggleSound(){
        this.#sfxOn = !this.#sfxOn;
    }

    playSound(trackKey){
        if(this.#sfxOn){
            const sound = this.#sounds[trackKey];
            sound.volume = this.#sfxVolume / 100;
            sound.currentTime = 0;
            sound.play();
        }
    }
    soundVolumeUp(){
        if(this.#sfxVolume < 100){
            this.#sfxVolume++;
        }
    }
    soundVolumeDown(){
        if(this.#sfxVolume > 0){
            this.#sfxVolume--;
        }
    }
}

const gameSound = new GameSound();

export { gameSound }