import { Mouse } from "./Mouse.js";
import { Vector2 } from "./Vector2.js";
import { Sprite } from "./Sprite.js";

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
        this.sprite = new Sprite(this.x-50, this.y);

        this.topVertices = [
            IsometricTile.projectPoint(0, 0),
            IsometricTile.projectPoint(this.height, 0),
            IsometricTile.projectPoint(this.height, this.height),
            IsometricTile.projectPoint(0, this.height)
        ];

        this.borderSize = 10;

        this.rightVertices = [
            IsometricTile.projectPoint(this.height, 0),
            IsometricTile.projectPoint(this.height+this.borderSize, this.borderSize),
            IsometricTile.projectPoint(this.height+this.borderSize, this.height+this.borderSize),
            IsometricTile.projectPoint(this.height, this.height)
        ];

        this.leftVertices = [
            IsometricTile.projectPoint(0, this.height),
            IsometricTile.projectPoint(this.borderSize, this.height+this.borderSize),
            IsometricTile.projectPoint(this.height+this.borderSize, this.height+this.borderSize),
            IsometricTile.projectPoint(this.height, this.height)
        ];

        this.updateSprite();

    }

    update() {
        // Renderer.ctx.fillStyle = this.color;
        this.mouseIsOver = Mouse.isInsideSprite(this.sprite);
    }

    draw() {
        this.sprite.draw();
    }

    updateSprite() {
        this.sprite.clear();
        this.sprite.resize(this.width, this.height+this.borderSize);
        this.sprite.drawPolygon(this.topVertices, this.color, this.height);
        this.sprite.fill();
        this.sprite.stroke();
        this.sprite.drawPolygon(this.rightVertices, "#c1c1c1", this.height);
        this.sprite.fill();
        this.sprite.drawPolygon(this.leftVertices, "#a1a1a1", this.height);
        this.sprite.fill();
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