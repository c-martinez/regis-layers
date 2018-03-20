import { BaseLayer } from '../layers/baselayer';

export abstract class Connector {
    constructor() { }

    public abstract buildLayer(layer: BaseLayer): any;
    public abstract buildMarker(lat: number, lng: number, draggable: boolean): any;
    public abstract setLayerVisibility(layer: BaseLayer, active: boolean, type: string);
}
