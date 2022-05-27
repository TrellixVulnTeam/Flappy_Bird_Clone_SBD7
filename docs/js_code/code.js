/* eslint-disable max-len */
"use strict";
// init variables
let canvas;
let ctx;
let cWidth;
let cHeight;
let startButton;
let saveButton;

// imgs
const imgArray = new Array(20);
imgArray[0] = new Image();
imgArray[1] = new Image();

// velocities
// foreground
let fgX = 0;
let fgV;
// background
let bgX = 0;
let bgV;
// bird
let yV;
let gravity;
let jumpPower;

// bird variables
let xbird;
let ybird;
let birdlength;
let birdheight;

// pillar variables
// top
let randomYLength;
let randomYLength2;
let initYLength;
let initYLength2;
let initXLength;
let abstand;

// delay
let hasNotJumped = true;
let currentPoints;

// Points
let points;
let isAlive = true;

// time variables
let deltaTime = 0;
let lastFrameTime = 0;
let fps;

// Database

// TODO: jumping is still not relative, also the display of the score.
// ****************************         Initialisierung nachdem alles geladen hat           **************************** //

window.onload = function init() {
    // init variables
    // Main Canvas
    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d", { antialias: true });
    canvas.width = screen.width * .6;
    canvas.height = screen.height * .9;
    cWidth = canvas.width;
    cHeight = canvas.height;

    // Start Button
    startButton = document.getElementById("startButton");
    startButton.addEventListener("click", clickHandler);
    // Save Button
    saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", saveHandler);

    // imgs
    imgArray[0].src = "assets/mongolia2.jpg";
    imgArray[1].src = "assets/spongebob.gif";

    // velocities
    // foreground
    fgV = cHeight / 3.072;
    // background
    bgV = cHeight / 15.36;
    // bird
    yV = 0;
    gravity = cHeight / 9;
    jumpPower = cHeight * 3;

    // bird variables
    xbird = cWidth / 5.12;
    ybird = cHeight / 2.16;
    birdlength = cWidth / 15;
    birdheight = cHeight / 12;

    // pillar variables
    // top
    randomYLength = [cHeight / 6.48, cHeight / 3.24, cHeight / 4.32, cHeight / 1.851, cHeight / 2.16, cHeight / 2.592];
    randomYLength2 = [cHeight / 1.993, cHeight / 2.357, cHeight / 2.88, cHeight / 3.7, cHeight / 5.184, cHeight / 2];
    initYLength = cHeight / 2.16;
    initYLength2 = cHeight / 3.24;
    initXLength = cWidth / 5.24;
    abstand = cHeight / 3.085;

    // Points
    points = 0;
    currentPoints = points;
    localStorage.setItem("Points", points);

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
    repeatImage(imgArray[0], counter, bgX, -cHeight, cWidth * 2, cHeight * 2, 2, false, false, false);
    // Säulen Top
    repeatImage(imgArray[1], counter + 1, fgX + cWidth / 2, 0, initXLength, initYLength, 1, true, true, true);
    repeatImage(imgArray[1], counter + 1, fgX, 0, initXLength, initYLength2, 1, true, true, false);
    // Säulen Bottom
    repeatImage(imgArray[1], counter + 1, fgX + cWidth / 2, initYLength + abstand, initXLength, cHeight, 1, true, false, true);
    repeatImage(imgArray[1], counter + 1, fgX, initYLength2 + abstand, initXLength, cHeight, 1, true, false, false);
    // Draw Ground
    repeatImage(imgArray[1], counter, fgX, cHeight - cHeight / 12, cWidth, cHeight, 1, false, false, false);

    // Draw  Fps to the screen
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cWidth, 45);
    ctx.font = "125% Arial";
    ctx.fillStyle = "red";
    ctx.fillText("FPS: " + fps + " cwidth:" + cWidth + " cheight:" + cHeight + " Points: " + points + " currentPoints: " + currentPoints, 10, 30);

    // drawing the rectangle
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.fillRect(xbird, ybird, birdlength, birdheight);

    if (!isAlive) {
        const path = new Path2D();
        path.rect(xbird, ybird, birdlength, birdheight);
        path.closePath();
        ctx.fillStyle = "red";
        ctx.fill(path);
    }

    // Draw points in middle of screen
    if (currentPoints + 1 == points) {
        ctx.beginPath();
        ctx.font = "500% Arial";
        ctx.fillStyle = "white";
        ctx.fillText(points, xbird + birdlength / 3, cHeight / 3);
        pointDisplay();
    }
}

// do physics
function fixedUpdate() {
    // fall
    ybird += yV * deltaTime;

    // gravity
    if (ybird < cHeight - birdheight) {
        yV += gravity;
    } else {
        yV = 0;
    }

    // friction
    yV *= 0.9;

    // background movement
    bgX -= bgV * deltaTime;
    // forground movement
    fgX -= fgV * deltaTime;

    // stop game if ground touched
    if (ybird + birdheight > cHeight - cHeight / 12) {
        die();
    }
}

// ****************************         Advanced stuff for the game in the canvas           **************************** //

// will repeat the image after one repeater duration
// image: image that should be used, counter: used to count how many pictures are already drawn,
// xPos and yPos: start Position of the image, xLength and yLength: size of the picture,
// repeater: tells at which rate the picture should be redrawn,
// isPillaar: boolean for pillar or background
function repeatImage(image, counter, xPos, yPos, xLength, yLength, repeater, isPillar, isTop, first) {
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
            die();
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
            die();
        }
        if (isAlive) {
            if (newXPos <= xbird && newXPos >= xbird - cWidth / 219 && isTop) {
                points += 1;
            }
        }
    }
    // draw next image, after the current image x is less than 0
    if (newXPos < 0) {
        counter += repeater;
        // choose next yLength
        const i = counter % randomYLength.length;
        if (isPillar && isTop && first) {
            repeatImage(image, counter, xPos, yPos, xLength, randomYLength[i], repeater, isPillar, isTop, first);
        } else if (isPillar && isTop && !first) {
            repeatImage(image, counter, xPos, yPos, xLength, randomYLength2[i], repeater, isPillar, isTop, first);
        } else if (isPillar && !isTop && first) {
            repeatImage(image, counter, xPos, randomYLength[i] + abstand, xLength, yLength, repeater, isPillar, isTop, first);
        } else if (isPillar && !isTop && !first) {
            repeatImage(image, counter, xPos, randomYLength2[i] + abstand, xLength, yLength, repeater, isPillar, isTop, first);
        } else {
            repeatImage(image, counter, xPos, yPos, xLength, yLength, repeater, isPillar, isTop, first);
        }
    }
}

// get input and jump
window.addEventListener("keydown", (event) => {
    if (event.key === " " && hasNotJumped) {
        event.preventDefault();
        // jump
        yV -= jumpPower;
        jumpPause();
    }
});

// Delay until time is over
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
// Delay next jump, so the player cant spam jumping.
async function jumpPause() {
    hasNotJumped = false;
    await delay(150);
    hasNotJumped = true;
}
// Show Points on screen only for a short time
async function pointDisplay() {
    await delay(500);
    currentPoints = points;
}

function die() {
    isAlive = false;
    yV = 0;
    jumpPower = 0;
    // bgV = 0;
    fgV = 0;
}

// ****************************        Game Controller for start & death screen              **************************** //
// Start & and restart game
// eslint-disable-next-line no-unused-vars
function clickHandler(event) {
    console.log("startButton Clicked");
    window.location.reload();
}
// save points
// eslint-disable-next-line no-unused-vars
function saveHandler(event) {
    console.log("saveButton Clicked");
    localStorage.setItem("Points", points);
}
// ****************************             Change language & other stuff                   **************************** //