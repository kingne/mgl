let textureID = 0;
export class Texture {

    constructor(gl, name, image, unit, glType = "SAMPLER_2D") {
        this.id = ++textureID;
        this.gl = gl;
        this.name = name;
        this.image = image;
        this.unit = unit;
        this.glType = glType;
    }
}