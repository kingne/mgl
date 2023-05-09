let attributeID = 0;
export class Attribute {

    constructor(name, data, size, type = "FLOAT", normalize = false) {
        this.id = ++attributeID;
        this._name = name;
        this.data = data;
        this.size = size;
        this.type = type;
        this.normalize = normalize;
        this.buffer = null;
        this.version = 0;
        this.prefix = "a_";
    }

    setData(data, offset = 0) {
        let updateIdx = -1;
        for (let i = offset; i < data.length; i++) {
            if (this.data[i] !== data[i]) {
                this.data[i] = data[i];
                if (updateIdx === -1) {
                    updateIdx = i;
                }
            }
        }

        if (updateIdx !== -1) {
            this.version++;
        }

        if (!this.buffer) {
            console.error('buffer not be init');
        }

        this.buffer.setData(new Float32Array(data), updateIdx);

        return this;
    }

    get count() {
        return Math.floor(this.data.length / this.size);
    }

    get name() {
        return this.prefix + this._name;
    }

    delete() {
        if (this.buffer) {
            this.buffer.delete();
            this.buffer = null;
        }

        return this;
    }
}