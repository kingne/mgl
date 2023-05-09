import { Shader, glShaderType } from "./shader";

export class Program {

    constructor(gl, vSource, fSource, checkError = true) {
        this.gl = gl;
        this.vSource = vSource;
        this.fSource = fSource;
        this.vShader = null;
        this.fShader = null;
        this.program = null;
        this.checkError = checkError;
        this.error = null;

        this.attributes = null;
        this.uniforms = null;
        this._attribNames = null;
        this._uniformNames = null;

        this.init();
    }

    init() {
        if (!this.vShader) {
            this.vShader = new Shader(this.gl, glShaderType.vertex, this.vSource, this.checkError);
        }

        if (!this.vShader.shader && !this.vShader.error) {
            this.vShader.init();
        }

        if (!this.fShader) {
            this.fShader = new Shader(this.gl, glShaderType.fragment, this.fSource, this.checkError);
        }

        if (!this.fShader.shader && !this.fShader.error) {
            this.fShader.init();
        }

        if (!this.vShader.shader || !this.fShader.shader) return this;

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vShader.shader);
        this.gl.attachShader(this.program, this.fShader.shader);
        this.gl.linkProgram(this.program);

        if (this.checkError) {
            this.checkLinked();
        }

        this.initVariables();

        return this;
    }

    checkLinked() {
        const linked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
        if (!linked) {
            const err = this.gl.getProgramInfoLog(this.program);
            this.error = err;
            console.error(err);
            this.delete();
        }

        return this;
    }

    initVariables() {
        if (!this.program) return ;

        if (!this.attributes) {
            this.attributes = {};
            const num = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < num; i++) {
                const info = this.gl.getActiveAttrib(this.program, i);
                const location = this.gl.getAttribLocation(this.program, info.name);
                this.attributes[info.name] = { info, location };
            };
        }

        if (!this.uniforms) {
            this.uniforms = {};
            const num = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < num; i++) {
                const info = this.gl.getActiveUniform(this.program, i);
                const location = this.gl.getUniformLocation(this.program, info.name);
                this.uniforms[info.name] = { info, location };
            }
        }
    }

    getAttribLocation(name) {
        return this.attributes[name].location;
    }

    getUniformLocation(name) {
        return this.uniforms[name].location;
    }

    get attribNames() {
        if (!this._attribNames) {
            if (!this.attributes) return [];
            this._attribNames = Object.keys(this.attributes);
        }
        return this._attribNames;
    }

    get uniformNames() {
        if (!this._uniformNames) {
            if (!this.uniforms) return [];
            this._uniformNames = Object.keys(this.uniforms);
        }
        return this._uniformNames;
    }

    use() {
        if (!this.program) return;
        this.gl.useProgram(this.program);
        return this;
    }

    delete() {

        if (this.program) {
            this.gl.deleteProgram(this.program);
            this.program = null;
        }
        if (this.vShader) this.vShader.delete();
        if (this.fShader) this.fShader.delete();

        return this;
    }
}