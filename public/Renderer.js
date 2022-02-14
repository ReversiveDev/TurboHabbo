

export class Renderer {

    static canvas;
    static ctx;
    /**
     * @private
     */
    static _cursor;

    static get cursor(){
        return Renderer._cursor;
    }

    static set cursor(value){
        Renderer._cursor = value;
        Renderer.canvas.style.cursor = value;
    }

    static init() {
        Renderer.canvas = document.getElementById('game');
        Renderer.canvas.width = window.innerWidth;
        Renderer.canvas.height = window.innerHeight;
        // Renderer.canvas.style.backgroundColor = '#000';
        Renderer.canvas.style.backgroundImage = 'linear-gradient(red, yellow)';
        Renderer.ctx = Renderer.canvas.getContext('2d');
        Renderer.ctx.imageSmoothEnabled = false;

        document.body.appendChild(Renderer.canvas);
    }

    static drawPath(path) {
        Renderer.ctx.beginPath();
        Renderer.ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            Renderer.ctx.lineTo(path[i].x, path[i].y);
        }
    }

}