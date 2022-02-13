import { Mouse } from "./Mouse.js";
import { Renderer } from "./Renderer.js";
import { Vector2 } from "./Vector2.js";

export class IsometricTile {

    get rectHitBox() {
        return {
            x: this.x - this.width / 2,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    constructor(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.height = 32;
        this.width = this.height * 2;
        this.color = color;
        this.mouseIsOver = false;

        this.vertices = [
            IsometricTile.projectPoint(0, 0).add(this),
            IsometricTile.projectPoint(this.height, 0).add(this),
            IsometricTile.projectPoint(this.height, this.height).add(this),
            IsometricTile.projectPoint(0, this.height).add(this)
        ];

    }

    draw() {
        Renderer.ctx.fillStyle = this.color;
        this.mouseIsOver = Mouse.isInsideRect(this.rectHitBox) && Mouse.isInsidePolygon(this.vertices)
        if (this.mouseIsOver) {
            Renderer.ctx.fillStyle = '#f00';
        }
        Renderer.drawPath(this.vertices);
        Renderer.ctx.fill();
    }

    static projectPoint(x, y) {
        if (x instanceof Vector2) {
            return IsometricTile.projectPoint(x.x, x.y);
        }
        return new Vector2(
            x - y,
            (x + y) / 2
        );
    }

}