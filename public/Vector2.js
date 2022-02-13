

export class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static get ZERO() {
        return new Vector2(0, 0);
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    div(v) {
        return new Vector2(this.x / v.x, this.y / v.y);
    }

    mul(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let length = this.mag();
        return this.div(length);
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}