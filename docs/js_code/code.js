window.onload = function(){
    let canvas = document.getElementById("mainCanvas");
    let ctx = canvas.getContext("2d", {antialias: true});
    var select = document.getElementById("selectLang");
    var de = "./index.html";
    var de = "./englishIndex.html";

    ctx.beginPath()
    ctx.moveTo(50, 100);
    ctx.lineTo(400, 200);
    ctx.stroke();

    ctx.beginPath()
    ctx.rect(400, 200, 100, 100);
    ctx.stroke();


    select.onchange = function() {
        location.de = this.german;
    }
}
