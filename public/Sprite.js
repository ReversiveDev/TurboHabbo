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
    /**
     * @private
     */
    _toDo = [];

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
        this.canvas.width = 1;
        this.canvas.height = 1;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.image = new Image();
        this.image.src = source;
        this.image.onerror = () => {};
        if(source === undefined) {
            this.loaded = true;
        }else {
            this.image.onload = () => {
                this.loaded = true;
                this.canvas.width = this.image.width;
                this.canvas.height = this.image.height;
                if(this._toDo.length > 0) {
                    for(let task of this._toDo) {
                        task.apply(this);
                        break;
                    }
                    this._toDo = [];
                }
                this.drawImage(this.image, 0, 0);
            }

            this.image.onerror = () => {
                console.error(`Error loading image: ${source}`);
            }
        }
    }

    clear() {
        if(!this.loaded) {
            this._toDo.push(() => this.clear());
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updated = false;
    }

    drawRect(x, y, width, height, color) {
        if(!this.loaded) {
            this._toDo.push(() => this.drawRect(x, y, width, height, color));
            return;
        }
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        this.updated = false;
    }

    drawPolygon(points, color, x = 0, y = 0) {
        if(!this.loaded) {
            this._toDo.push(() => this.drawPolygon(points, color, x, y));
            return;
        }
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
        return new Promise(resolve => {
            if(!image) resolve();
            if(!this.loaded) {
                this._toDo.push(() => this.drawImage(image, x, y));
                resolve();
            }
            if(image instanceof Sprite){
                image = image.canvas;
                this.ctx.drawImage(image, x, y);
                this.update = false;
                resolve();
            }else if(typeof image === 'string') {
                image = new Image();
                image.src = image;
                image.onload = () => {
                    this.drawImage(image, x, y);
                    this.updated = false;
                    resolve();
                }
            }else {
                this.ctx.drawImage(image, x, y);
                this.updated = false;
                resolve();
            }
        });
    }

    fill() {
        if(!this.loaded) {
            this._toDo.push(() => this.fill());
            return;
        }
        this.ctx.fill();
        this.updated = false;
    }

    stroke() {
        if(!this.loaded) {
            this._toDo.push(() => this.stroke());
            return;
        }
        this.ctx.stroke();
        this.updated = false;
    }

    resize(width, height = this.width) {
        if(!this.loaded) {
            this._toDo.push(() => this.expand(width, height));
            return;
        }
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

    flipH(){
        if(!this.loaded) {
            this._toDo.push(() => this.flipH());
            return;
        }
        let newCanvas = document.createElement('canvas');
        let newCtx = newCanvas.getContext('2d');
        newCtx.imageSmoothingEnabled = false;
        newCanvas.width = this.width;
        newCanvas.height = this.height;
        newCtx.translate(newCanvas.width, 0);
        newCtx.scale(-1, 1);
        newCtx.drawImage(this.canvas, 0, 0);
        this.canvas = newCanvas;
        this.ctx = newCtx;
        this.updated = false;
    }

    loadPixels() {
        if(!this.loaded) {
            this._toDo.push(() => this.loadPixels());
            return;
        }
        this._pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
    }

    draw() {
        if(!this.loaded) return;
        Renderer.ctx.drawImage(this.canvas, this.x, this.y);
    }

    WaitLoad(){
        return new Promise(resolve => {
            let int = setInterval(() => {
                if(this.loaded) {
                    clearInterval(int);
                    resolve();
                }
            }, 100);
        });
    }

    getPixel(x, y) {
        if(!this.loaded) return;
        if(x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height) return null;
        let index = (x + y * this.canvas.width) * 4;
        return new Pixel(new Color(this.pixels[index], this.pixels[index+1], this.pixels[index+2], this.pixels[index+3]), x, y);
    }

}