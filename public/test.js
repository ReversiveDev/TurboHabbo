import { Renderer } from "./Renderer.js";
import { Mouse } from "./Mouse.js";
import { RoomFurni } from "./RoomFurni.js";

// parse url parameters
let URLParams = {};
window.location.search.substr(1).split("&").map(x => {
    let parts = x.split("=");
    URLParams[parts[0]] = parts[1];
    return parts;
});

Renderer.init();
Mouse.init();

let furni = new RoomFurni(URLParams.furniname || "chair_basic", 500, 300, 0, URLParams.direction || 0);

; (function update() {
    Renderer.cursor = "default";
    // clear canvas
    Renderer.ctx.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

    furni.draw();

    requestAnimationFrame(update);

})();