import { Renderer } from "./Renderer.js";
import { IsometricTile } from "./IsometricTile.js";
import { Mouse } from "./Mouse.js";
import { Vector2 } from "./Vector2.js";
import { Sprite } from "./Sprite.js";

Renderer.init();
Mouse.init();

let tiles = [];
let roomWidth = 10;
let roomHeight = 10;
let roomX = innerWidth/2;
let roomY = 200;

for(let x = 0; x < roomWidth; x++) {
    for(let y = 0; y < roomHeight; y++) {
        let p = IsometricTile.projectPoint(x * 32, y * 32);
        tiles.push(new IsometricTile(p.x + roomX, p.y + roomY, 0, '#fff'));
    }
}

let top = [
    IsometricTile.projectPoint(0, 0),
    IsometricTile.projectPoint(32, 0),
    IsometricTile.projectPoint(32, 32),
    IsometricTile.projectPoint(0, 32)
];

;(function update(){
    // clear canvas
    Renderer.ctx.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

    // draw tiles
    let selectedTile = null;
    for(let i = tiles.length-1; i >= 0; i--) {
        let tile = tiles[i];
        if(tile.mouseIsOver && !selectedTile) {
            tile.color = '#ccc';
            selectedTile = tile;
            tile.updateSprite();
        }else if(tile.color == '#ccc') {
            tile.color = '#fff';
            tile.updateSprite();
        }
    }
    for(let tile of tiles) {
        tile.update();
        tile.draw();
    }

    requestAnimationFrame(update);

})();