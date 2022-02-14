import { Renderer } from "./Renderer.js";
import { IsometricTile } from "./IsometricTile.js";
import { Mouse } from "./Mouse.js";
import { Sprite } from "./Sprite.js";
import { XMLParser } from "./XMLParser.js";

// parse url parameters
let URLParams = {};
window.location.search.substr(1).split("&").map(x => {
    let parts = x.split("=");
    URLParams[parts[0]] = parts[1];
    return parts;
});

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

let furniName = URLParams.furniname || "chair_plasty";
let layerCount = 0;
let direction = URLParams.direction || 0;
let state = 0;
let size = 64;
let sprites = [];
let furniX = Math.floor(innerWidth / 2);
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
        let sprs = [];
        let furni = new Sprite(furniX, furniY);
        let maxW = 0;
        let maxH = 0;
        let maxX = 0;
        let maxY = 0;
        let flipH = false;
        for (let i = 0; i < layerCount; i++) {
            let layer = String.fromCharCode(97 + i);
            let name = `${furniName}_${size}_${layer}_${direction}_${state}`;
            if (!json[name]) continue;
            let spr = new Sprite(0, 0, `/assets/furniture/${furniName}/${json[name].source || name}.png`);

            await spr.WaitLoad();
            sprs.push(spr);

            if (spr.width > maxW) maxW = spr.width;
            if (spr.height > maxH) maxH = spr.height;
            if (Number(json[name].x) > maxX) maxX = Number(json[name].x);
            if (Number(json[name].y) > maxY) maxY = Number(json[name].y);
            if (json[name].flipH) flipH = true;
        }
        furni.resize(maxW, maxH);

        for (let i = 0; i < layerCount; i++) {
            let layer = String.fromCharCode(97 + i);
            let name = `${furniName}_${size}_${layer}_${direction}_${state}`;
            if (!json[name]) continue;
            let spr = sprs[i];
            furni.drawImage(spr, maxX - Number(json[name].x), maxY - Number(json[name].y));
        }
        if (flipH) furni.flipH();
        furni.x -= Math.floor(maxW / 2);
        sprites.push(furni);
    });

; (function update() {
    Renderer.cursor = "default";
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
        if (Mouse.isInsideSprite(sprite)) {
            Renderer.cursor = "pointer";
        }
    }

    requestAnimationFrame(update);

})();