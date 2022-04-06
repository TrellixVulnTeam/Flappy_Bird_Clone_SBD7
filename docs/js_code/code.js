window.onload = function(){
    let canvas = document.getElementById("mainCanvas");
    let ctx = canvas.getContext("2d", {antialias: true});

    ctx.moveTo(50, 100);
    ctx.lineTo(400, 200);
    ctx.stroke();

    ctx.rect(400, 200, 100, 100);
    ctx.stroke();
}
