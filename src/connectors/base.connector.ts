import { BaseLayer } from '../layers/baselayer';

export abstract class Connector {
    constructor() { }

    public abstract buildLayer(layer: BaseLayer): any;
}
