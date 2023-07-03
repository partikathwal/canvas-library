# Canvas

## Getting the canvas

```
/** @type {HTMLCanvasElement} */
const canvas = document.getElementsByName("canvas")[0];
const ctx = canvas.getContext("2d");
```
The type reference allows Intellisense on `canvas` as well as `ctx`.

## Sizing

```
// ❌ CSS stretches it
// canvas.style.width = "1920px"
// canvas.style.height = "1080px"

// ✅ DO THIS
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
```

Keeping the width and height in a variable avoids unnecessarily accessing the DOM.

## Drawing

```
// line
ctx.beginPath()         // grab a pencil
ctx.moveTo(0,0)         // put it down here
ctx.lineTo(1280,720);   // draw a line to here
ctx.stroke();           // (now actually draw it)


// rectangle
ctx.fillRect(x, y, w, h); // top-left (x,y); size (w,h)

```