import { BaseLayer } from './baselayer';

export class GroupLayer extends BaseLayer {
    public dataSource: string;

    constructor(id, name, active, url) {
        super(id, name, 'group', active);
        if (url === undefined) { throw new Error('GroupLayer: url not defined'); }
        this.dataSource = url;
    }
}
