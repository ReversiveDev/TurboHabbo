import { Renderer } from "./Renderer.js";
import { IsometricTile } from "./IsometricTile.js";
import { Mouse } from "./Mouse.js";
import { Sprite } from "./Sprite.js";
import { XMLParser } from "./XMLParser.js";

Renderer.init();
Mouse.init();

let tiles = [];
let roomWidth = 10;
let roomHeight = 10;
let roomX = innerWidth / 2;
let roomY = 200;

for (let x = 0; x < roomWidth; x++) {
    for (let y = 0; y < roomHeight; y++) {
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

let furniName = 'chair_basic';
let layerCount = 0;
let direction = 2;
let state = 0;
let size = 64;
let sprites = [];
let furniX = Math.floor(innerWidth/2);
let furniY = 300;
fetch(`/assets/furniture/${furniName}/${furniName}_visualization.xml`)
    .then(async response => {
        let xml = await response.text();
        let json = XMLParser.toJSON(xml).visualization;
        layerCount = json[size].layerCount;
    });
fetch(`/assets/furniture/${furniName}/${furniName}_assets.xml`)
    .then(async response => {
        let json = XMLParser.toJSON(await response.text()).asset;
        for (let i = 0; i < layerCount; i++) {
            let layer = String.fromCharCode(97 + i);
            let name = `${furniName}_${size}_${layer}_${direction}_${state}`;
            let sprite = new Sprite(furniX - Number(json[name].x), furniY - Number(json[name].y), `/assets/furniture/${furniName}/${json[name].source || name}.png`);
            sprites.push(sprite);
        }
    });

; (function update() {
    // clear canvas
    Renderer.ctx.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

    // draw tiles
    // let selectedTile = null;
    // for(let i = tiles.length-1; i >= 0; i--) {
    //     let tile = tiles[i];
    //     if(tile.mouseIsOver && !selectedTile) {
    //         tile.color = '#ccc';
    //         selectedTile = tile;
    //         tile.updateSprite();
    //     }else if(tile.color == '#ccc') {
    //         tile.color = '#fff';
    //         tile.updateSprite();
    //     }
    // }
    // for(let tile of tiles) {
    //     tile.update();
    //     tile.draw();
    // }

    // draw sprites
    for (let sprite of sprites) {
        // sprite.update();
        sprite.draw();
    }

    requestAnimationFrame(update);

})();