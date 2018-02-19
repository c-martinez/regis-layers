import { BaseLayer } from './baselayer';

export class DynamicLayer extends BaseLayer {
    public dataSource: string;

    constructor(id, name, active, url: string) {
        super(id, name, 'dynamic', active);
        if (url === undefined) { throw new Error('DynamicLayer: url not defined'); }
    }
}
