let shaderID = 0;

export const glShaderType = {
    vertex:"VERTEX_SHADER",
    fragment: "FRAGMENT_SHADER",
}

export class Shader {

    constructor(gl, glType, source, checkError = true) {
        this.id = ++shaderID;
        this.gl = gl;
        this.glType = glType;
        this.source = source.trim();
        this.shader = null;
        this.checkError = checkError;
        this.error = null;

        this.init();
    }

    init() {
        if (!this.shader) {
            this.shader = this.gl.createShader(this.gl[this.glType])
            this.gl.shaderSource(this.shader, this.source);
            this.gl.compileShader(this.shader);
            if (this.checkError) {
                this.checkCompiled();
            }
        }

        return this;
    }

    checkCompiled() {
        const compiled = this.gl.getShaderParameter(this.shader, this.gl.COMPILE_STATUS);
        if (!compiled) {
            const err = this.gl.getShaderInfoLog(this.shader);
            this.error = err;
            console.error(err);
            this.delete();
        }

        return this;
    }

    delete() {
        if (this.shader) {
            this.gl.deleteShader(this.shader);
            this.shader = null;
        }

        return this;
    }
}