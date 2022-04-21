"use strict";
// init variables
let canvas;
let ctx;
let cWidth;
let cHeight;

// imgs
const imgArray = new Array(20);
imgArray[0] = new Image();
imgArray[1] = new Image();

// draw variables
let fgX = 0;
const fgV = 150;
let bgX = 0;
const bgV = 50;
let y = 0;
let yV = 10;

// time variables
let deltaTime = 0;
let lastFrameTime = 0;
let fps;

// ****************************         Initialisierung nachdem alles geladen hat           **************************** //
window.onload = function init() {
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d", { antialias: true });

    canvas.width = screen.width * .6;
    canvas.height = screen.height * .7;
    cWidth = canvas.width;
    cHeight = canvas.height;

    imgArray[0].src = "assets/mongolia.png";
    imgArray[1].src = "assets/spongebob.gif";

    // start first Frame request
    window.requestAnimationFrame(gameLoop);
};

// ****************************         Basic stuff for the game inside the canvas          **************************** //
function gameLoop(timeStamp) {
    // clear all
    ctx.clearRect(0, 0, cWidth, cHeight);

    // Calculate the number of seconds passed since the last frame
    deltaTime = (timeStamp - lastFrameTime) / 1000;
    lastFrameTime = timeStamp;

    // Calculate fps
    fps = Math.round(1 / deltaTime);

    // draw
    update();
    // physics
    fixedUpdate();

    // keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

// draw
function update() {
    // background image
    const counter = 0;
    repeatImage(imgArray[0], counter, bgX, -cHeight / 9, cWidth * 2, cHeight * 2, 2);
    repeatImage(imgArray[1], counter, fgX, cHeight - cHeight / 12, cWidth, cHeight, 1);

    // Draw  Fps to the screen
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cWidth, 45);
    ctx.font = "25px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("FPS: " + fps + " " + cWidth + " " + cHeight, 10, 30);

    // drawing the rectangle
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(150, y, cWidth / 15, cHeight / 10);
}

// do physics
function fixedUpdate() {
    // fall
    y += yV * deltaTime;

    // gravity
    if (y < cHeight - 60) {
        yV += 9.81;
    } else {
        yV = 0;
    }

    // background movement
    bgX -= bgV * deltaTime;
    // forground movement
    fgX -= fgV * deltaTime;
}

// ****************************         Advanced stuff for the game in the canvas           **************************** //
// will repeat the image after one repeater duration
function repeatImage(image, counter, x, y, xLength, yLength, repeater) {
    ctx.drawImage(image, x + cWidth * counter, y, xLength, yLength);
    if (x + cWidth * counter < 0) {
        counter += repeater;
        repeatImage(image, counter, x, y, xLength, yLength, repeater);
    }
}

// get input
window.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        // TODO: make jumpforce relative to different screen sizes;
        event.preventDefault();
        yV -= 1000;
    }
});


// ****************************             Change language & other stuff                   **************************** //