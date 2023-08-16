import { canvas, ctx } from "./canvas.js";

class FadeOverlay {
    #visible = true;
    #max = 20;
    #opacity = this.#max;
    #fadingToBlack = false;
    #fadingFromBlack = false;
    #onToBlackFinish = null;
    #onFromBlackFinish = null;
    draw(){
        if(!this.#visible) return;

        ctx.fillStyle = `rgba(0,0,0, ${this.#opacity / this.#max})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if(this.#fadingToBlack){
            this.#opacity++;
            if(this.#opacity >= this.#max){
                this.#opacity = this.#max;
                this.#fadingToBlack = false;
                if(this.#onToBlackFinish){
                    this.#onToBlackFinish();
                    this.#onToBlackFinish = false;
                }
            }
        }
        else
        if(this.#fadingFromBlack){
            this.#opacity--;
            if(this.#opacity <= 0){
                this.#opacity = 0;
                this.#fadingFromBlack = false;
                this.#visible = false;
                if(this.#onFromBlackFinish){
                    this.#onFromBlackFinish();
                    this.#onFromBlackFinish = null;
                }
            }
        }
        
    }
    toBlack(callback = null){
        this.#visible = true;
        this.#fadingToBlack = true;
        this.#onToBlackFinish = callback;
    }
    fromBlack(callback = null){
        this.#fadingFromBlack = true;
        this.#onFromBlackFinish = callback;
    }
}

const fadeOverlay = new FadeOverlay();

export { fadeOverlay }