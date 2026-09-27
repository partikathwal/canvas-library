/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 480;


const state = {
    grid: [],
    painting: false
}

function initGrid(){
    const a = [];
    for(let i = 0; i < canvas.width; i++){
        const b = [];
        for(let j = 0; j < canvas.height; j++){
            b.push(0);
        }
        a.push(b);
    }
    state.grid = a;
}

function drawGridLines(){
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i = 0; i < canvas.height; i += 20){
        // horizontal
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
    }
    for(let j = 0; j < canvas.width; j += 20){
        // vertical
        ctx.moveTo(j, 0);
        ctx.lineTo(j, canvas.height);
    }
    ctx.stroke();
}

drawGridLines();