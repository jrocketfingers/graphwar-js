/*
 *   Graph implementation
 */
var graphwar;
(function (graphwar) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.distance = function (to) {
            return Math.sqrt((this.x - to.x) ^ 2 + (this.y - to.y) ^ 2);
        };
        return Point;
    })();
    graphwar.Point = Point;
    var Graph = (function () {
        function Graph(id, xlim, ylim) {
            this.canvas = document.getElementById(id);
            this.context = this.canvas.getContext('2d');
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.xlim = xlim;
            this.ylim = ylim;
            this.xscale = this.width / Math.abs(xlim.lower - xlim.upper);
            this.yscale = this.height / Math.abs(ylim.lower - ylim.upper);
            this.locked = false;
            this.drawAxes();
        }
        Graph.prototype.drawAxes = function () {
            // Draw the axes.
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.strokeStyle = "#a2a2a2";
            // y-axis
            this.context.moveTo(-this.xlim.lower * this.xscale, 0);
            this.context.lineTo(-this.xlim.lower * this.xscale, this.height);
            // x-axis
            this.context.moveTo(0, this.ylim.upper * this.yscale);
            this.context.lineTo(this.width, this.ylim.upper * this.yscale);
            this.context.stroke();
            this.context.closePath();
        };
        Graph.prototype.clear = function () {
            this.context.clearRect(0, 0, this.width, this.height);
            this.drawAxes();
        };
        Graph.prototype.translate = function (p) {
            p.x = (p.x - this.xlim.lower) * this.xscale;
            p.y = (-p.y + this.ylim.upper) * this.yscale;
            return p;
        };
        Graph.prototype.shoot = function (f, origin, speed, step, maxIters, xIsOrigin) {
            var plotshot = new PlotShot(this, f, origin, speed, step, maxIters, xIsOrigin);
        };
        Graph.prototype.draw = function (from, to) {
            this.context.save();
            this.context.scale(this.xscale, -this.yscale);
            this.context.translate(-this.xlim.lower, this.ylim.lower);
            this.context.beginPath();
            this.context.strokeStyle = "#000000";
            this.context.lineWidth = 1 / this.xscale;
            this.context.moveTo(from.x, from.y);
            this.context.lineTo(to.x, to.y);
            this.context.stroke();
            this.context.closePath();
            this.context.restore();
        };
        Graph.prototype.free = function () {
            this.locked = false;
        };
        return Graph;
    })();
    graphwar.Graph = Graph;
    var PlotShot = (function () {
        function PlotShot(graph, f, origin, speed, step, maxIters, xIsOrigin) {
            var _this = this;
            this.graph = graph;
            this.interval = setInterval(function () { return _this.render(); }, 1000 / speed);
            this.iteration = 0;
            this.origin = origin;
            this.xOffset = xIsOrigin ? 0 : origin.x;
            this.yOffset = f(this.xOffset) - origin.y;
            this.prevX = this.origin.x;
            this.prevY = this.origin.y;
            this.maxIterations = maxIters;
            this.f = f;
            this.step = step;
        }
        PlotShot.prototype.render = function () {
            if (this.iteration < this.maxIterations && this.prevX <= this.graph.xlim.upper && this.prevY <= this.graph.ylim.upper && this.prevY >= this.graph.ylim.lower) {
                this.iteration++;
                this.graph.draw(new Point(this.prevX, this.prevY), new Point(this.getX(), this.getY()));
                this.prevX = this.getX();
                this.prevY = this.getY();
            }
            else {
                clearInterval(this.interval);
                this.graph.free();
            }
        };
        PlotShot.prototype.getX = function () {
            return this.step * this.iteration + this.origin.x;
        };
        PlotShot.prototype.getY = function () {
            return this.f(this.step * this.iteration + this.xOffset) - this.yOffset;
        };
        return PlotShot;
    })();
})(graphwar || (graphwar = {}));
//# sourceMappingURL=graph.js.map