import { Renderer } from "./Renderer.js";
import { Pixel } from "./Pixel.js";
import { Color } from "./Color.js";

export class Sprite {

    loaded = false;
    updated = true;
    /**
     * @private
     */
    _pixels = [];

    get pixels() {
        if(this.updated){
            return this._pixels;
        }
        this.loadPixels();
        this.updated = true;
        return this._pixels;
    }

    get width() {
        return this.canvas.width;
    }

    get height() {
        return this.canvas.height;
    }

    constructor(x, y, source) {
        this.x = x;
        this.y = y;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.image = new Image();
        this.image.src = source;
        if(source === undefined) {
            this.loaded = true;
        }else {
            this.image.onload = () => {
                console.log(x, y)
                this.loaded = true;
                this.canvas.width = this.image.width;
                this.canvas.height = this.image.height;
                this.drawImage(this.image, 0, 0);
            }

            this.image.onerror = () => {
                console.error(`Error loading image: ${source}`);
            }
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updated = false;
    }

    drawRect(x, y, width, height, color) {
        if(!this.loaded) return;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.updated = false;
    }

    drawPolygon(points, color, x = 0, y = 0) {
        if(!this.loaded) return;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x+x, points[0].y+y);
        for(let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x+x, points[i].y+y);
        }
        this.ctx.closePath();
        this.updated = false;
    }

    drawImage(image, x = 0, y = 0) {
        if(!this.loaded || !image) return;
        this.ctx.drawImage(image, x, y);
        this.updated = false;
    }

    fill() {
        this.ctx.fill();
        this.updated = false;
    }

    stroke() {
        this.ctx.stroke();
        this.updated = false;
    }

    expand(width, height) {
        if(!this.loaded) return;
        let newCanvas = document.createElement('canvas');
        let newCtx = newCanvas.getContext('2d');
        newCtx.imageSmoothingEnabled = false;
        newCanvas.width = width;
        newCanvas.height = height;
        newCtx.drawImage(this.canvas, 0, 0);
        this.canvas = newCanvas;
        this.ctx = newCtx;
        this.updated = false;
    }

    loadPixels() {
        if(!this.loaded) return;
        this._pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    }

    draw() {
        if(!this.loaded) return;
        Renderer.ctx.drawImage(this.canvas, this.x, this.y);
    }

    getPixel(x, y) {
        if(!this.loaded) return;
        if(x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) return null;
        let index = (x + y * this.canvas.width) * 4;
        return new Pixel(new Color(this.pixels[index], this.pixels[index+1], this.pixels[index+2], this.pixels[index+3]), x, y);
    }

}