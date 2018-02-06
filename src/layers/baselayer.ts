export class BaseLayer {
    public id: number;
    public name: string;
    public active: boolean;
    public type: string;

    constructor(id, name, type, active) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.type = type;
    }
}
