/* eslint-disable max-len */
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
const xbird = 150;
let ybird = 400;
let birdlength;
let birdheight;
let yV = 10;

// delay
let hasNotJumped = true;

// time variables
let deltaTime = 0;
let lastFrameTime = 0;
let fps;

// FIXME: i need to make every size relative to the screen
// ****************************         Initialisierung nachdem alles geladen hat           **************************** //

window.onload = function init() {
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d", { antialias: true });

    canvas.width = screen.width * .6;
    canvas.height = screen.height * .9;
    cWidth = canvas.width;
    cHeight = canvas.height;

    birdlength = cWidth / 15;
    birdheight = cHeight / 12;

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
    repeatImage(imgArray[0], counter, bgX, -cHeight / 9, cWidth * 2, cHeight * 2, 2, false, false);
    repeatImage(imgArray[1], counter, fgX, cHeight - cHeight / 12, cWidth, cHeight, 1, false, false);

    // FIXME: make pillar heigth random
    // Säulen Top
    repeatImage(imgArray[1], counter, fgX + cWidth / 2, 0, 100, 300, 1, true, true);
    repeatImage(imgArray[1], counter, fgX, 0, 100, 200, 1, true, true);
    // Säulen Bottom
    repeatImage(imgArray[1], counter, fgX + cWidth / 2, 300 + 210, 100, 300, 1, true, false);
    repeatImage(imgArray[1], counter, fgX, 200 + 210, 100, 400, 1, true, false);

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
    ctx.fillRect(xbird, ybird, birdlength, birdheight);
}

// do physics
function fixedUpdate() {
    // fall
    ybird += yV * deltaTime;

    // gravity
    if (ybird < cHeight - birdheight) {
        yV += 70;
    } else {
        yV = 0;
    }

    // friction
    yV *= 0.9;

    // background movement
    bgX -= bgV * deltaTime;
    // forground movement
    fgX -= fgV * deltaTime;
}

// ****************************         Advanced stuff for the game in the canvas           **************************** //

// will repeat the image after one repeater duration
// image: image that should be used, counter: used to count how many pictures are already drawn,
// xPos and yPos: start Position of the image, xLength and yLength: size of the picture,
// repeater: tells at which rate the picture should be redrawn,
// isPillaar: boolean for pillar or background
function repeatImage(image, counter, xPos, yPos, xLength, yLength, repeater, isPillar, isTop) {
    const newXPos = xPos + cWidth * counter;
    ctx.drawImage(image, newXPos, yPos, xLength, yLength);
    // check if the pillar touched the bird
    if (isPillar) {
        // check if pillar is top
        if (newXPos <= xbird + birdlength && newXPos + xLength >= xbird && yLength >= ybird && isTop) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(newXPos, yPos);
            ctx.lineTo(newXPos, yLength);
            ctx.lineTo(newXPos + xLength, yLength);
            ctx.lineTo(newXPos + xLength, yPos);
            ctx.stroke();
            yV = 0;
        }
        // check if pillar is bottom
        if (newXPos <= xbird + birdlength && newXPos + xLength >= xbird && ybird + birdlength >= yPos && !isTop) {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.moveTo(newXPos, cHeight);
            ctx.lineTo(newXPos, yPos);
            ctx.lineTo(newXPos + xLength, yPos);
            ctx.lineTo(newXPos + xLength, cHeight);
            ctx.stroke();
            yV = 0;
        }
    }
    // draw next image, after the current image x is less than 0
    if (newXPos < 0) {
        counter += repeater;
        repeatImage(image, counter, xPos, yPos, xLength, yLength, repeater, isPillar, isTop);
    }
}

// get input and jump
window.addEventListener("keydown", (event) => {
    if (event.key === " " && hasNotJumped) {
        event.preventDefault();
        // jump
        yV -= cHeight * 3;
        test();
    }
});

// Delay next jump, so the player cant spam jumping.
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
async function test() {
    hasNotJumped = false;
    await delay(150);
    hasNotJumped = true;
}

// ****************************             Change language & other stuff                   **************************** //