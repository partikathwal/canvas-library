## What is this?
This is a library of files that contain objects and methods and patterns that can be used for game dev.

It should not contain actual game logic, but customizable and reusable components, as well as notes, that can help in getting to the building process quicker, rather than reinventing the wheel each time.

It must be used as a git submodule. It will be versioned so that if multiple projects use it, they can checkout the commit they developed against and not break unless a migration is done manually.

## Stuff I want here
- boiler plate stuff
- common objects (shapes, players, objects)
- common patterns (screens/scenes, animation, timing, layers)
- UI components (bg, menu, lists, text stuff, icons)
- resource management (audio, images, loading, storing, sprites)

## What I need to do now

Find common things in each game project and in notes.

Make simple projects that use components and abstract them here.


# Boiler Plate Stuff

## Setup

### Canvas

First, the HTML

```
<canvas id="canvas" />
```

Next the CSS

```
canvas { position: absolute; top: 0; left: 0; }
```

Now the JS

```
/** @type {HTMLCanvasElement} */
const context = document.getElementById("canvas");
const ctx = context.getContext("2d");

// fixed dimensions
canvas.width = 1280;
canvas.height = 720;

// responsive (full screen)
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // update any object values that copied these values
})
```

The type annotation is super helpful since it allows everything canvas and context related to have autocomplete.

Don't use CSS for the canvas size, that will stretch the canvas. Use JS (which is equivalent to using HTML attributes).

### Animation Loop
```
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // stuff that needs to happen on every render

    requestAnimationFrame(animate)
}

window.onload = function(){
    animate();
}
```
By putting the animate call in the window.onload function, we are allowing the page as well as its resources (images, etc) to load first before we start our animation.

## Drawing

This is a good point to make sure you know your game design. You should have classes to represent all your objects, each with an draw and update method. Mostly it will include drawing images, but also shapes and text. Here's a cheat sheet on how to draw all that.

(Or see this: https://simon.html5.org/dump/html5-canvas-cheat-sheet.html)

#### Line
```
ctx.beginPath();        // grab a pencil
ctx.moveTo(50, 50);     // put pencil here
ctx.lineTo(100, 100);   // draw to here
ctx.stroke();           // render line
```

#### Polygon
```
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(100, 100);
ctx.lineTo(150, 100);
ctx.lineTo(100, 50);
ctx.closePath();        // connects last two dots
ctx.fill();             // stroke also an option
```

#### Rectangle
```
ctx.fillRect(20, 20, 50, 50, "#a0d");
```

#### Circle
```
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
ctx.stroke();
```

#### Image
```
ctx.drawImage(imageObj, posX, posY, [posW, posH, [cropX, cropY, cropW, cropH]])
```

#### Text
```
ctx.font = "12px Arial"
ctx.fillText("Hello World", posX, posY)
```

#### Rotation
```
ctx.save();
ctx.translate(newOriginX, newOriginY);
ctx.rotate(angle);
ctx.restore();
```