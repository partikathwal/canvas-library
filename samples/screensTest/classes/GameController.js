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

    up(){
        this.mapping.up?.();
    }
    down(){
        this.mapping.down?.();
    }
    left(){
        this.mapping.left?.();
    }
    right(){
        this.mapping.right?.();
    }
    spacebar(){
        this.mapping.spacebar?.();
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
                    controller.up();
                    break;
                case "ArrowDown":
                    controller.down();
                    break;
                case "ArrowLeft":
                    controller.left();
                    break;
                case "ArrowRight":
                    controller.right();
                    break;
                case " ":
                    controller.spacebar();
                    break;
                default:
                    break;
            }
        })
    }
}

const controller = new GameController();

export { controller }