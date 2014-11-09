/*
 *   Graph implementation
 */

module graphwar {

    export module util {
        export interface Limit {
            lower: number;
            upper: number;
        }

        export interface OneParameterFunction {
            (x: number) : number;
        }
    }

    export class Point {
        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        distance(to: Point) {
            return Math.sqrt((this.x - to.x)^2 + (this.y - to.y)^2);
        }
    }

    export class Graph {
        canvas: HTMLCanvasElement;
        context: CanvasRenderingContext2D;
        width: number;
        height: number;

        private locked: boolean;

        xlim: util.Limit;
        ylim: util.Limit;
        xscale: number;
        yscale: number;

        constructor(id: string, xlim: util.Limit, ylim: util.Limit) {
            this.canvas = <HTMLCanvasElement> document.getElementById(id);
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

        drawAxes() {
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
        }

        clear() {
            this.context.clearRect(0, 0, this.width, this.height);

            this.drawAxes();
        }

        private translate(p: Point) : Point {
            p.x = (p.x - this.xlim.lower) * this.xscale;
            p.y = (-p.y + this.ylim.upper) * this.yscale;

            return p;
        }

        shoot(f: util.OneParameterFunction, origin: Point, speed: number, step: number, maxIters: number, xIsOrigin: boolean) {
            var plotshot = new PlotShot(this, f, origin, speed, step, maxIters, xIsOrigin);
        }

        draw(from: Point, to: Point) {
            this.context.beginPath();
            this.context.strokeStyle = "#000000";
            this.context.lineWidth = 2;

            from = this.translate(from);
            to = this.translate(to);

            this.context.moveTo(from.x, from.y);
            this.context.lineTo(to.x, to.y);

            this.context.stroke();
            this.context.closePath();
        }

        free() {
            this.locked = false;
        }
    }

    class PlotShot {
        graph: Graph;

        private interval: number;
        private iteration: number;

        maxIterations: number;
        step: number;

        private prevX: number;
        private prevY: number;

        private xOffset: number;
        private yOffset: number;

        private origin: Point;

        f: util.OneParameterFunction;

        constructor(graph: Graph, f: util.OneParameterFunction, origin: Point, speed: number, step:number, maxIters: number, xIsOrigin: boolean) {
            this.graph = graph;

            this.interval = setInterval(() => this.render(), 1000/speed);
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

        private render() : void {
            if(this.iteration < this.maxIterations
               && this.prevX < this.graph.xlim.upper
               && this.prevY < this.graph.ylim.upper) {

                this.iteration++;

                this.graph.draw(new Point(this.prevX, this.prevY), new Point(this.getX(), this.getY()));
                this.prevX = this.getX();
                this.prevY = this.getY();
            }
            else {
                clearInterval(this.interval);
                this.graph.free();
            }
        }

        private getX() : number {
            return this.step * this.iteration + this.origin.x;
        }

        private getY() : number {
            return this.f(this.step * this.iteration + this.xOffset) - this.yOffset;
        }
    }
}
