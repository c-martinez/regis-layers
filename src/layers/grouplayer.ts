import { BaseLayer } from './baselayer';

export class GroupLayer extends BaseLayer {
    public dataSource: string;

    constructor(id, name, active, url) {
        super(id, name, 'group', active);
        this.dataSource = url;
    }
}
