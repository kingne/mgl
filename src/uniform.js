let uniformID = 0;
export class Uniform {

    constructor(name, data, glType) {
        this.id = ++uniformID;
        this._name = name;
        this.data = data;
        this.glType = glType;
        this.version = 0;
        this.prefix = 'u_';
    }

    get name() {
        return this.prefix + this._name;
    }

    setData(data) {
        this.data = data;
    }
}