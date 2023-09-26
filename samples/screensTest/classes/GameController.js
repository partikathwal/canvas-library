/**
 * @typedef {Object} ControllerMapping
 * @property {?function} up
 * @property {?function} down
 * @property {?function} right
 * @property {?function} left
 * @property {?function} spacebar
 */

class GameController {
    mapping = {
        up: null,
        down: null,
        left: null,
        right: null,
        spacebar: null
    }

    buttons = {
        upPressed: false,
        downPressed: false,
        leftPressed: false,
        rightPressed: false,
        spacebarPressed: false,
    }

    up(released){
        if(this.buttons.upPressed && released){
            this.buttons.upPressed = false;
        }else{
            this.buttons.upPressed = true;
            this.mapping.up?.();
        }
    }
    down(released){
        if(this.buttons.downPressed && released){
            this.buttons.downPressed = false;
        }else{
            this.buttons.downPressed = true;
            this.mapping.down?.();
        }
    }
    left(released){
        if(this.buttons.leftPressed && released){
            this.buttons.leftPressed = false;
        }else{
            this.buttons.leftPressed = true;
            this.mapping.left?.();
        }
    }
    right(released){
        if(this.buttons.rightPressed && released){
            this.buttons.rightPressed = false;
        }else{
            this.buttons.rightPressed = true;
            this.mapping.right?.();
        }
    }
    spacebar(released){
        if(this.buttons.spacebarPressed && released){
            this.buttons.spacebarPressed = false;
        }else{
            this.buttons.spacebarPressed = true;
            this.mapping.spacebar?.();
        }
    }

    /**
     * 
     * @param {ControllerMapping} mapping
     */
    setMapping(mapping){
        this.mapping.up = mapping.up || null;
        this.mapping.down = mapping.down || null;
        this.mapping.left = mapping.left || null;
        this.mapping.right = mapping.right || null;
        this.mapping.spacebar = mapping.spacebar || null;
    }

    init(){
        document.addEventListener("keydown", (e) => {
            switch(e.key){
                case "ArrowUp":
                    this.up();
                    break;
                case "ArrowDown":
                    this.down();
                    break;
                case "ArrowLeft":
                    this.left();
                    break;
                case "ArrowRight":
                    this.right();
                    break;
                case " ":
                    this.spacebar();
                    break;
                default:
                    break;
            }
        });

        document.addEventListener("keyup", (e) => {
            switch(e.key){
                case "ArrowUp":
                    this.up(true);
                    break;
                case "ArrowDown":
                    this.down(true);
                    break;
                case "ArrowLeft":
                    this.left(true);
                    break;
                case "ArrowRight":
                    this.right(true);
                    break;
                case " ":
                    this.spacebar(true);
                    break;
                default:
                    break;
            }
        })
    }
}

const controller = new GameController();

export { controller }