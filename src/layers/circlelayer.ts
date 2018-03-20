import { BaseLayer } from './baselayer';

export class CircleLayer extends BaseLayer {
    public dataSource: string;
    public center: number[];
    public radius: number;

    constructor(id: string, name: string, active: true, center: number[], radius: number) {
        super(id, name, 'circle', active);
        if (center === undefined) { throw new Error('CircleLayer: center not defined'); }
        if (center.length !== 2)  { throw new Error('CircleLayer: center should have 2 components'); }
        if (radius === undefined) { throw new Error('CircleLayer: radius not defined'); }
        this.center = center;
        this.radius = radius;
    }
}
