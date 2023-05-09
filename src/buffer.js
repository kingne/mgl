export class ArrayBuffer {

    constructor(gl, data, size, normalize = false, usage = "STATIC_DRAW", isIndexArray = false) {
        this.gl = gl;
        this.data = data;
        this.size = size;
        this.normalize = normalize
        this.usage = usage;
        this.isIndexArray = isIndexArray;
        this.target = isIndexArray ? "ELEMENT_ARRAY_BUFFER" : "ARRAY_BUFFER";
        this.buffer = null;
        this.version = 0;
        this.location = null;
        this._dirty = false;
        this.init();
    }

    init() {
        if (!this.buffer) {
            this.buffer = this.gl.createBuffer();
        }
        this.gl.bindBuffer(this.gl[this.target], this.buffer);
        this.gl.bufferData(this.gl[this.target], this.data, this.gl[this.usage]);
        this._dirty = true;

        return this;
    }

    setData(data, offset = 0) {
        let updateIdx = -1;
        for (let i = offset; i < data.length; i++) {
            if (this.data[i] !== data[i]) {
                if (updateIdx === -1) {
                    updateIdx = i;
                }
                this.data[i] = data[i];
            }
        }
        if (updateIdx !== -1) {
            this.gl.bindBuffer(this.gl[this.target], this.buffer);
            this.bufferSubData(this.gl[this.target], updateIdx, data);
            this.version++;
            this._dirty = true;
        }

        return this;
    }

    upload(location) {
        if (!this._dirty) return;
        if (!this.buffer) return;
        if (!this.location || this.location !== location) {
            this.location = location;
        }
        this.gl.bindBuffer(this.gl[this.target], this.buffer);
        this.gl.vertexAttribPointer(
            this.location,
            this.size,
            this.gl.FLOAT,
            false,
            0,
            0
        );
        this.gl.enableVertexAttribArray(this.location);
        this._dirty = false;
    }

    delete() {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }

        return this;
    }
}

export function createBuffer(gl, attribute) {
    const buffer = new ArrayBuffer(
        gl,
        new Float32Array(attribute.data),
        attribute.size,
        attribute.normalize
    )
    attribute.buffer = buffer;
    return buffer;
}