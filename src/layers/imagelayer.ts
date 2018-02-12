import { BaseLayer } from './baselayer';

export class ImageLayer extends BaseLayer {
    public dataSource: string;
    public bounds: number[][];

    constructor(id, name, active, url: string, bounds: number[][]) {
        super(id, name, 'image', active);
        this.dataSource = url;
        this.bounds = bounds;
    }
}
