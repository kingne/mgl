import { createBuffer } from "./buffer";

export class DrawCall {

    constructor(gl, program, attributes, uniforms, textures, mode = "TRANGLES") {
        this.gl = gl;
        this.program = program;
        this.attributes = attributes;
        this.uniforms = uniforms;
        this.textures = textures;
        this.mode = mode;
        this.start = 0;
        this.count = 0;
        this.isIndexArray = false;
    }

    setDrawRange(count, start = 0) {
        if (this.start !== start) {
            this.start = start;
        }
        if (this.count !== count) {
            this.count = count;
        }
        return this;
    }

    upload() {
        this.program.use();
        this.setAttributes();
        this.setUniforms();
    }

    draw() {
        if (this.count === 0) {
            this.count = this.attributes['a_position'].count;
        }
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    }

    setAttributes() {
        const names = this.program.attribNames;
        for(let i = 0; i < names.length; i++) {
            const attribute = this.attributes[names[i]];
            if (!attribute) {
                console.error(`attribute: ${names[i]} not be set`);
            }
            if (!attribute.buffer) {
                createBuffer(this.gl, attribute);
            }
            attribute.buffer.upload(
                this.program.getAttribLocation(names[i])
            )
        }
    }

    setUniforms() {
        const names = this.program.uniformNames;
        for (let i = 0; i < names.length; i++) {
            const uniform = this.uniforms[names[i]];
            if (!uniform) {
                console.error(`uniform: ${names[i]} not be set`)
            }
            switch(uniform.glType) {
                case 'VEC4':
                    this.gl.uniform4fv(
                        this.program.getUniformLocation(names[i]),
                        new Float32Array(uniform.data)
                    )
                    break;
            }
        }
    }
}