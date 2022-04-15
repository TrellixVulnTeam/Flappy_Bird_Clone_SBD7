"use strict";
//init variables
var canvas;
var ctx;
var width;
var height;

//imgs
var imgArray = new Array();
imgArray[0] = new Image();

//draw variables
var imgX = 0;
var imgXV = 100;
var y = 0;
var yV = 10;

//time variables
var deltaTime = 0;
var lastFrameTime = 0;
var fps;

window.onload = function init() {

    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d", {antialias: true});
    width = canvas.scrollWidth;
    height = canvas.scrollHeight;
    
    imgArray[0].src = 'assets/mongolia.png';
    
    //start first Frame request
    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    //clear all
    ctx.clearRect(0, 0, width, height);
    
    // Calculate the number of seconds passed since the last frame
    deltaTime = (timeStamp - lastFrameTime) / 1000;
    lastFrameTime = timeStamp;
    
    // Calculate fps
    fps = Math.round(1/deltaTime);
    
    //draw
    update();
    //physics
    fixedUpdate();

    //keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

function update() {
    //background image
    var counter = 0;
    repeatBackground(imgArray[0], counter);

    // Draw  Fps to the screen
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 115, 45);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText("FPS: " + fps, 10, 30);

    //drawing the rectangle
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(150, y, 50, 50);
}

function fixedUpdate() {
    //fall
    y += yV * deltaTime;

    // gravity
    if (y < height - 60) {
        yV += 9.81;
    }
    else {
        yV = 0;
    }

    // background movement
    imgX -= imgXV * deltaTime *5;
}

// repeat background
function repeatBackground(image, counter) {
    ctx.drawImage(image, imgX+width*counter, 0, width, height);
    if (imgX+width*counter < 0){
        counter += 1;
        repeatBackground(image, counter);
    }
}