import { BaseLayer } from './baselayer';

export class GeoJsonLayer extends BaseLayer {
    public url: string;

    constructor(id, name, active, url) {
        super(id, name, 'geojson', active);
        this.url = url;
    }
}
