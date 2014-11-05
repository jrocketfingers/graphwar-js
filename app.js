function draw() {
    var canvas = document.getElementById('graph');
    var ctx = canvas.getContext('2d');

    var step = 0.1;

    function f(x) {
        return (1/(1+Math.exp(-x)))*10 + 18*(-1/(1+Math.exp(-(x-10)))) + 18*(1/(1+Math.exp(-(x-20)*2)));
    }

    ctx.translate(250, 250);
    ctx.scale(10, -10);

    // draw the axes
    ctx.beginPath();
    ctx.lineWidth = 0.1;

    ctx.moveTo(-250, 0);
    ctx.lineTo(250, 0);
    ctx.moveTo(0, -250);
    ctx.lineTo(0, 250);

    ctx.stroke();
    ctx.closePath();

    // set-up for drawing the graph
    ctx.beginPath();
    ctx.lineWidth = 0.005;
    ctx.strokeStyle = "rgb(255,0,0)";

    ctx.moveTo(-250, 0);

    render(ctx, -25, -25, 25, step, f);

    console.log("Drawing.");
}

function render(ctx, i, lower, upper, step, f) {
    console.log("Render call.");
    if(i < lower)
        console.error("Current iterator at a value lower than the lower limit! You messed up something in the draw call!");
    else if(i > upper) {
        ctx.closePath();
    } else {
        ctx.lineTo(i, f(i));
        ctx.stroke();
        setTimeout(function() { render(ctx, i + step, lower, upper, step, f); }, 5);
    }
}

draw();