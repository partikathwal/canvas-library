import { canvas, ctx } from "./canvas.js";

class LayoutsTestScreen {
    constructor(){
        const box1 = new Box("black");
        const box2 = new Box("red");
        const box3 = new Box("green");
        const box4 = new Box("blue");
        this.layout1 = new FlexLayout({
            x: 50,
            y: 50,
            width: 250,
            height: 200,
            justify: FlexLayout.justification.EVENLY,
            color: "purple"
        }, box1, box2);

        this.layout2 = new FlexLayout({
            x: 50,
            y: 50,
            width: 250,
            height: 200,
            color: "teal"
        }, box3, box4);

        this.mainLayout = new FlexLayout({
            x: 20,
            y: 20,
            width: 500,
            height: 400,
            color: "white"
        }, this.layout1, this.layout2)
    }
    draw(){
        this.mainLayout.draw();
    }
    update(){}
}


class Box {
    x;
    y;
    width = 80;
    height = 40;
    constructor(color){
        this.color = color;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class FlexLayout {

    static justification = {
        START: "START",
        END: "END",
        CENTER: "CENTER",
        AROUND: "AROUND",
        EVENLY: "EVENLY",
        BETWEEN: "BETWEEN"
    }

    static orientation = {
        HORIZONTAL: "HORIZONTAL",
        VERTICAL: "VERTICAL"
    }

    constructor(config, ...drawables){
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.justify = config.justify || FlexLayout.justification.END;
        this.orientation = config.orientation || FlexLayout.orientation.HORIZONTAL

        this.mainAxis = this.orientation === FlexLayout.orientation.HORIZONTAL ? "x" : "y";
        this.crossAxis = this.orientation === FlexLayout.orientation.HORIZONTAL ? "y" : "x";
        this.mainDimension = this.orientation === FlexLayout.orientation.HORIZONTAL ? "width" : "height";
        this.crossDimension = this.orientation === FlexLayout.orientation.HORIZONTAL ? "height" : "width";
        
        this.color = config.color;

        this.drawables = drawables;
    }

    start(){
        let positionPointer = this[this.mainAxis];
        this.drawables.forEach(d => {
            d[this.mainAxis] = positionPointer;
            d[this.crossAxis] = this[this.crossAxis] + (this[this.crossDimension] / 2) - (d[this.crossDimension] / 2);
            d.draw();
            positionPointer += d[this.mainDimension];
        })
    }
    end(){
        const totalHeight = this.drawables.reduce((total, d) => d[this.mainDimension] + total, 0);
        const totalSpace = this[this.mainDimension] - totalHeight;
        let positionPointer = this[this.mainAxis];
        positionPointer += totalSpace;

        this.drawables.forEach(d => {
            d[this.mainAxis] = positionPointer;
            d[this.crossAxis] = this[this.crossAxis] + (this[this.crossDimension] / 2) - (d[this.crossDimension] / 2);
            d.draw();
            positionPointer += d[this.mainDimension];
        })
    }
    center(){
        const totalHeight = this.drawables.reduce((total, d) => d[this.mainDimension] + total, 0);
        const totalSpace = this[this.mainDimension] - totalHeight;
        const gapHeight = totalSpace / 2;
        let positionPointer = this[this.mainAxis];
        positionPointer += gapHeight;

        this.drawables.forEach(d => {
            d[this.mainAxis] = positionPointer;
            d[this.crossAxis] = this[this.crossAxis] + (this[this.crossDimension] / 2) - (d[this.crossDimension] / 2);
            d.draw();
            positionPointer += d[this.mainDimension];
        })
    }

    spaceAround(){
        const totalHeight = this.drawables.reduce((total, d) => d[this.mainDimension] + total, 0);
        const totalSpace = this[this.mainDimension] - totalHeight;
        const gapHeight = totalSpace / (this.drawables.length * 2);
        let positionPointer = this[this.mainAxis];

        this.drawables.forEach(d => {
            positionPointer += gapHeight;
            d[this.mainAxis] = positionPointer;
            d[this.crossAxis] = this[this.crossAxis] + (this[this.crossDimension] / 2) - (d[this.crossDimension] / 2);
            d.draw();
            positionPointer += d[this.mainDimension];
            positionPointer += gapHeight;
        })
    }

    spaceBetween(){
        const totalHeight = this.drawables.reduce((total, d) => d[this.mainDimension] + total, 0);
        const totalSpace = this[this.mainDimension] - totalHeight;
        const gapHeight = totalSpace / (this.drawables.length - 1);
        let positionPointer = this[this.mainAxis];

        this.drawables.forEach(d => {
            d[this.mainAxis] = positionPointer;
            d[this.crossAxis] = this[this.crossAxis] + (this[this.crossDimension] / 2) - (d[this.crossDimension] / 2);
            d.draw();
            positionPointer += d[this.mainDimension];
            positionPointer += gapHeight;
        })
    }

    spaceEvenly(){
        const totalHeight = this.drawables.reduce((total, d) => d[this.mainDimension] + total, 0);
        const totalSpace = this[this.mainDimension] - totalHeight;
        const gapHeight = totalSpace / (this.drawables.length + 1);
        let positionPointer = this[this.mainAxis];

        this.drawables.forEach(d => {
            positionPointer += gapHeight;
            d[this.mainAxis] = positionPointer;
            d[this.crossAxis] = this[this.crossAxis] + (this[this.crossDimension] / 2) - (d[this.crossDimension] / 2);
            d.draw();
            positionPointer += d[this.mainDimension];
        })
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height)

        // space-evenly
        if(this.justify === FlexLayout.justification.START){
            this.start();
        }else
        if(this.justify === FlexLayout.justification.END){
            this.end();
        }else
        if(this.justify === FlexLayout.justification.CENTER){
            this.center();
        }else
        if(this.justify === FlexLayout.justification.AROUND){
            this.spaceAround();
        }else
        if(this.justify === FlexLayout.justification.BETWEEN){
            this.spaceBetween();
        }else
        if(this.justify === FlexLayout.justification.EVENLY){
            this.spaceEvenly();
        }
    }
}
/*

Different kinds of layouts
But a Layout gets drawables added to it
layout.draw() => layout.objects.forEach(o => o.draw())
    But based on the layout, it will modify the x and y to draw the objects at.


Flex Container
- flex direction // nah
- flex-wrap // hmm...
- flex-flow (shorthand for above 2, so nah)
x justify-content // yes
    - flex-start
    - flex-end
    - center
    - space-between
    - space-around
    - space-evenly
- align-items
    - flex-start
    - flex-end
    - center
    - stretch
    - baseline  // nah
- align-content // not now
- gap, row-gap, column-gap // nah
*/


const layoutsTestScreen = new LayoutsTestScreen();

export { layoutsTestScreen }