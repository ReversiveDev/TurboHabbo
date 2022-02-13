

export class Color {

    constructor(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    static fromHex(hex) {
        if(typeof hex === 'number') {
            hex = hex.toString(16);
        }
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        let a = parseInt(hex.substring(6, 8), 16);
        return new Color(r, g, b, a);
    }

    static fromRGB(r, g, b, a) {
        return new Color(r, g, b, a);
    }

}