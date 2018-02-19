export class BaseLayer {
    public id: number;
    public name: string;
    public active: boolean;
    public type: string;

    constructor(id, name, type, active) {
        if (id === undefined) { throw new Error('BaseLayer: id not defined'); }
        if (type === undefined) { throw new Error('BaseLayer: type not defined'); }
        this.id = id;
        this.name = name;
        this.active = active;
        this.type = type;
    }
}
