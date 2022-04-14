"use strict";
//init variables
var canvas;
var ctx;
var width;
var height;
var select = document.getElementById("selectLang");
var de = "./index.html";
var de = "./englishIndex.html";

//draw variables
var imgX = 0;
var imgXV = 100;
var y = 0;
var yV = 10;

//time variables
var deltaTime = 0;
var lastFrameTime = 0;
var fps;

//imgs
var img = new Image();

window.onload = function init() {

    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d", {antialias: true});
    width = canvas.scrollWidth;
    height = canvas.scrollHeight;
    
    img.src = '/docs/assets/mongolia.png';
    
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
    //background color
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, imgX, 0, width, height);
    if (imgX < 0) {
        repeatBackground(img);
    }

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
    imgX -= imgXV * deltaTime;
}

// repeat background
function repeatBackground(image) {
    var counter;
    ctx.drawImage(image, imgX+width, 0, width, height);
    if (image < 0){
        repeatBackground(image);
    }
    counter += 1;
}