export class BaseLayer {
    public id: string;
    public name: string;
    public active: boolean;
    public type: string;

    constructor(id: string, name: string, type: string, active: boolean) {
        if (id === undefined) { throw new Error('BaseLayer: id not defined'); }
        if (type === undefined) { throw new Error('BaseLayer: type not defined'); }
        this.id = id;
        this.name = name;
        this.active = active;
        this.type = type;
    }
}
