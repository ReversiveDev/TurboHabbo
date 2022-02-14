import { Sprite } from "./Sprite.js";
import { XMLParser } from "./XMLParser.js";
import { Mouse } from "./Mouse.js";
import { Renderer } from "./Renderer.js";

export class RoomFurni {

    static cache = {
        visualization: {},
        asset: {},
        sprites: {}
    };

    constructor(name = "chair_basic", x = 0, y = 0, z = 0, direction = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.name = name;
        this.layerCount = 0;
        this.direction = direction;
        this.state = 0;
        this.size = 64;
        this.sprite = null;
        this.loaded = false;
        this.load();
    }

    draw() {
        if (!this.loaded) return;
        this.sprite.draw();
        if(Mouse.isInsideSprite(this.sprite)) {
            Renderer.cursor = "pointer";
        }
    }

    async load() {
        this.visualization = await this.getVisualization();
        this.layerCount = this.visualization[this.size].layerCount;
        this.asset = await this.getAsset();
        this.sprite = await this.getSprite();
        this.loaded = true;
        console.log("Loaded.");
    }

    getVisualization() {
        return new Promise((resolve, reject) => {
            if (RoomFurni.cache.visualization[this.name]) resolve(RoomFurni.cache.visualization[this.name]);
            fetch(`/assets/furniture/${this.name}/${this.name}_visualization.xml`).then(async response => {
                let xml = await response.text();
                let json = XMLParser.toJSON(xml).visualization;
                resolve(json);
            });
        });
    }

    getAsset() {
        return new Promise((resolve, reject) => {
            if (RoomFurni.cache.asset[this.name]) resolve(RoomFurni.cache.asset[this.name]);
            fetch(`/assets/furniture/${this.name}/${this.name}_assets.xml`).then(async response => {
                let json = XMLParser.toJSON(await response.text()).asset;
                resolve(json);
            });
        });
    }

    getSprite() {
        return new Promise(async (resolve, reject) => {
            if (RoomFurni.cache.sprites[`${this.name}_${this.direction}_${this.state}`]) resolve(RoomFurni.cache.sprites[`${this.name}_${this.direction}_${this.state}`]);
            let maxW = 0;
            let maxH = 0;
            let maxX = 0;
            let maxY = 0;
            let flipH = false;
            let furniParts = [];
            let furni = new Sprite(this.x, this.y);
            for (let i = 0; i < this.layerCount; i++) {
                let layer = String.fromCharCode(97 + i);
                let name = `${this.name}_${this.size}_${layer}_${this.direction}_${this.state}`;
                if (!this.asset[name]) continue;
                let sprite = new Sprite(0, 0, `/assets/furniture/${this.name}/${this.asset[name].source || name}.png`);

                await sprite.WaitLoad();
                furniParts.push(sprite);

                if (sprite.width > maxW) maxW = sprite.width;
                if (sprite.height > maxH) maxH = sprite.height;
                if (Number(this.asset[name].x) > maxX) maxX = Number(this.asset[name].x);
                if (Number(this.asset[name].y) > maxY) maxY = Number(this.asset[name].y);
                if (this.asset[name].flipH) flipH = true;
            }
            furni.resize(maxW, maxH);
            // furni.drawRect(0, 0, maxW, maxH, "black");

            for (let i = 0; i < furniParts.length; i++) {
                let layer = String.fromCharCode(97 + i);
                let name = `${this.name}_${this.size}_${layer}_${this.direction}_${this.state}`;
                if (!this.asset[name]) continue;
                furni.drawImage(furniParts[i], maxX - Number(this.asset[name].x), maxY - Number(this.asset[name].y));
            }
            // furni.x = Math.floor(maxW / 2);
            furni.y -= furni.height;
            if (flipH) furni.flipH();

            resolve(furni);
        });
    }

}