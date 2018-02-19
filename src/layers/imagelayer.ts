import { BaseLayer } from './baselayer';

export class ImageLayer extends BaseLayer {
    public dataSource: string;
    public bounds: number[][];

    constructor(id, name, active, url: string, bounds: number[][]) {
        super(id, name, 'image', active);
        if (url === undefined) { throw new Error('ImageLayer: url not defined'); }
        if (bounds === undefined) { throw new Error('ImageLayer: bounds not defined'); }
        if (bounds.length !== 2 || bounds[0].length !== 2 || bounds[1].length !== 2) {
            throw new Error('ImageLayer: bounds ill defined');
        }

        this.dataSource = url;
        this.bounds = bounds;
    }
}
