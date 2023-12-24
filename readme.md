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
ctx.fillRect(x, y, w, h, "#a0d");
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


## Objects

**Visible** objects can include the player, a platform, an NPC, an item, a text node, an image, or a button. Break the game up into objects the way you'd break a webpage into components.

**Non-visible** objects can include a user input manager (controller), a screen manager, a BGM manager, or game state.

Some objects are in-between. They may be view-related, but instead of being visible, they manage visible objects, like a layer or a layout. They may or may not have a draw or update method. If they do, likely they would simply call the objects' corresponding method (but otherwise that would still be handled by the main animation thread).

### Visible Objects
Here is an example of a class for a typical visible element:

    class ObjectName {

        // properties, including state and dependencies, e.g.
        x;
        y;
        speedX;
        speedY;
        screen; // possible dependency


        constructor(){
            // set initial state (or set that above)
            // attach references to dependencies
        }

        // other helpful functions that update or draw can use

        // other helpful functions that other objects can use

        update(){
            // update state
            // logic for how the state changes every frame
        }
        draw(){
            // draw the object to canvas context
        }
    }

More specifically...

    class Player {
        x = 500;
        y = 500;
        speedX = 5;
        speedY = 0;
        accelerationY = -1;
        inMidAir = false;
        sprite = null

        constructor(){
            this.sprite = imageManager.sprites.player;
        }

        jump(){
            this.inMidAir = true;
            this.speedY = 10;
        }

        update(){
            if(controller.left.isPressed){
                this.x -= this.speedX;
            }
            if(controller.right.isPressed){
                this.x += this.speedX;
            }
            if(controller.spacebar.isPressed && !this.inMidAir){
                this.jump();
            }

            if(this.inMidAir){
                this.speedY -= this.accelerationY;
                this.y -= this.speedY;
                if(this.speedY === -10) this.inMidAir = false;
            }
        }

        draw(){
            ctx.drawImage(this.sprite, this.x, this.y)
        }
    }


### Non-visible Objects

These don't have a "typical" representation. But here are some examples.

A Controller is one example.

Controllers can be state-based, event-based, or both. Some actions in a game react to a button being pressed. Others act *as long as* a button is held. A set of Controller mappings can be defined for every state a user can be in. For example, they may have the menu open, they may be walking, they may be midair, etc. In each of these situations, you may want different buttons to do different things. For each situation, or state, you can define what should happen when left gets pressed, otherwise what function should run as long as right is pressed. Thus the updating of a controllable object becomes delegated to the controller. Which makes sense. A controller controls by updating state.

Super Metroid: Samus can walk, jump, spin-jump, crouch, morph, shoot, charge, switch weapons, use x-ray vision

walk: while holding right/left
jump: after pressing A
spin-jump: while holding right/left, then after pressing A
crouch: after pressing down
morph: after pressing down again
shoot: after pressing B
charge: while holding B
switch weapons: after pressing select
use x-ray vision: while holding X

There are things you can control and things you can't.
You can control when the character can jump, but you can't control his height afterwards
    (Maybe there's some sensitivity to how high you jump)
    (So in that sense, you can control the acceleration, but not height)
The controller set state. But the object's update method handles automatic state changes