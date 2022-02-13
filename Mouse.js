import { Vector2 } from "./Vector2.js";
import { Renderer } from "./Renderer.js";

export class Mouse {

    static position = Vector2.ZERO;
    static down = false;

    static init() {
        document.addEventListener('mousemove', (e) => {
            Mouse.position.x = e.clientX;
            Mouse.position.y = e.clientY;
        });

        document.addEventListener('mousedown', (e) => {
            Mouse.down = true;
        });

        document.addEventListener('mouseup', (e) => {
            Mouse.down = false;
        });
    }

    // check if mouse is inside the given polygon
    static isInsidePolygon(polygon) {
        let px = Mouse.position.x;
        let py = Mouse.position.y;
        let inside = false;
        let next = 0;
        for (let current = 0; current < polygon.length; current++) {
            next = (current + 1) % polygon.length;
            let vc = polygon[current];
            let vn = polygon[next];
            if (
                ((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
                (px < (vn.x - vc.x) * (py - vc.y) / (vn.y - vc.y) + vc.x)
            ) {
                inside = !inside;
            }
        }
        return inside;
    }

    // check if mouse is inside the given rectangle
    static isInsideRect(rect) {
        let x = Mouse.position.x;
        let y = Mouse.position.y;
        return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
    }

    // check if mouse is inside the given sprite
    static isInsideSprite(sprite) {
        if(!sprite.loaded) return false;
        let x = Mouse.position.x;
        let y = Mouse.position.y;
        return this.isInsideRect(sprite) && sprite.getPixel(Math.floor(x - sprite.x), Math.floor(y - sprite.y))?.color.a > 0;
    }

}