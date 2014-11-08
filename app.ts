/// <reference path="graph.ts" />

/*function setupCanvas() {
    var canvas = <HTMLCanvasElement>document.getElementById('graph');
    var ctx = canvas.getContext('2d');

    ctx.translate(250, 250);
    ctx.scale(10, -10);
}

function draw() {
    var canvas = <HTMLCanvasElement>document.getElementById('graph');
    var ctx = canvas.getContext('2d');

    var step = 0.1;

    function f(x) {
        return (1/(1+Math.exp(-x)))*10 + 18*(-1/(1+Math.exp(-(x-10)))) + 18*(1/(1+Math.exp(-(x-20)*2)));
    }

    ctx.clearRect(-250, -250, 500, 500);

    // draw the axes
    ctx.beginPath();
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = "rgb(0,0,0)";

    ctx.moveTo(-25, 0);
    ctx.lineTo(25, 0);
    ctx.moveTo(0, -25);
    ctx.lineTo(0, 25);

    ctx.stroke();
    ctx.closePath();

    // set-up for drawing the graph
    ctx.beginPath();
    ctx.lineWidth = 0.005;
    ctx.strokeStyle = "rgb(255,0,0)";

    // get the offsets from the form
    var xorigin = parseInt(document.forms.change_origin.origin_x.value);
    var yorigin = parseInt(document.forms.change_origin.origin_y.value);
    var yoffset = yorigin - f(0);

    // move to the specified beggining
    ctx.moveTo(xorigin, yorigin);

    render(ctx, 0, 0, 50, step, f, xorigin, yoffset);

    console.log("Drawing.");
}

function render(ctx, i, lower, upper, step, f, xorigin, yoffset) {
    console.log("Render call.");
    if(i < lower)
        console.error("Current iterator at a value lower than the lower limit! You messed up something in the draw call!");
    else if(i > upper) {
        ctx.closePath();
    } else {
        ctx.lineTo(xorigin + i, f(i) + yoffset);
        console.log(i, f(i) + yoffset);
        ctx.stroke();
        setTimeout(function() { render(ctx, i + step, lower, upper, step, f, xorigin, yoffset); }, 5);
    }
} */

var xlim : CanvasGraph.Limit = {'lower': -25, 'upper': 25};
var ylim : CanvasGraph.Limit = {'lower': -25, 'upper': 25};
var graph = new CanvasGraph.Graph('graph', xlim, ylim);

function shoot() : void {
    var x = (<HTMLInputElement>document.getElementById('origin-x')).valueAsNumber;
    var y = (<HTMLInputElement>document.getElementById('origin-y')).valueAsNumber;

    graph.clear();
    graph.shoot(function (x) { return x - 10; }, new CanvasGraph.Point(x, y), 200, 1000, true);
}
