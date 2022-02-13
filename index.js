import { Renderer } from "./Renderer.js";
import { IsometricTile } from "./IsometricTile.js";
import { Mouse } from "./Mouse.js";
import { Vector2 } from "./Vector2.js";

Renderer.init();
Mouse.init();

let tiles = [];
let roomWidth = 10;
let roomHeight = 10;
let roomX = innerWidth/2-50;
let roomY = 200;

for(let x = 0; x < roomWidth; x++) {
    for(let y = 0; y < roomHeight; y++) {
        let p = IsometricTile.projectPoint(x * 32, y * 32);
        tiles.push(new IsometricTile(p.x + roomX, p.y + roomY, 0, '#fff'));
    }
}

;(function update(){
    // clear canvas
    Renderer.ctx.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

    // draw tiles
    for(let tile of tiles) {
        tile.draw();
    }

    requestAnimationFrame(update);

})();