"use strict";
//init variables
var canvas;
var ctx;
var cWidth;
var cHeight;

//imgs
var imgArray = new Array();
imgArray[0] = new Image();
imgArray[1] = new Image();

//draw variables
var fgX = 0;
var fgV = 150;
var bgX = 0;
var bgV = 50*10;
var y = 0;
var yV = 10;

//time variables
var deltaTime = 0;
var lastFrameTime = 0;
var fps;

// ****************************         Initialisierung nachdem alles geladen hat           **************************** //
window.onload = function init() {

    canvas = document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d", {antialias: true});

    canvas.width = screen.width*.6;
    canvas.height = screen.height*.7;
    cWidth = canvas.width;
    cHeight = canvas.height;
    
    imgArray[0].src = 'assets/mongolia.png';
    imgArray[1].src = 'assets/spongebob.gif';
    
    //start first Frame request
    window.requestAnimationFrame(gameLoop);
}

// ****************************         Basic stuff for the game inside the canvas          **************************** //
function gameLoop(timeStamp) {
    //clear all
    ctx.clearRect(0, 0, cWidth, cHeight);
    
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

// draw
function update() {
    //background image
    var counter = 0;
    repeatImage(imgArray[0], counter, bgX, -150, cWidth*2, cHeight*2, 2);
    repeatImage(imgArray[1], counter, fgX, cHeight-50, cWidth, cHeight, 1);

    // Draw  Fps to the screen
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cWidth, 45);
    ctx.font = '25px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText("FPS: " + fps+" "+cWidth+" "+cHeight, 10, 30);

    //drawing the rectangle
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(150, y, 50, 50);
}

// do physics
function fixedUpdate() {
    //fall
    y += yV * deltaTime;

    // gravity
    if (y < cHeight - 60) {
        yV += 9.81;
    }
    else {
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
    ctx.drawImage(image, x+cWidth*counter, y, xLength, yLength);
    if (x+cWidth*counter < 0){
        counter += repeater;
        repeatImage(image, counter, x, y, xLength, yLength, repeater);
    }
}

// get input
window.addEventListener('keydown', event => {
    if(event.key === ' '){
        event.preventDefault();
        yV -= 1000;
    }
});


// ****************************             Change language & other stuff                   **************************** //