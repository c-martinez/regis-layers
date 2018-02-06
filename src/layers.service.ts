import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseLayer } from './layers/baselayer';
import { GeoJsonLayer } from './layers/geojsonlayer';

import { Connector } from './connectors/base.connector';
import { LeafletConnector } from './connectors/leaflet.connector';


@Injectable()
export class LayersService {
  private layers: BaseLayer[] = []; // Meta-data of the layer (generic)
  private mapLayers: any[] = [];    // Implementation specific layer (e.g. Leaflet Layer object)
  private connector: Connector;

  constructor(private http: HttpClient) {
    this.connector = new LeafletConnector(http);
  }

  public addLayer(layer: BaseLayer) {
    const mapLayerPromise = this.connector.buildLayer(layer);

    this.layers.push(layer);

    // this.mapLayers.push(mapLayer);
    mapLayerPromise.subscribe(data => this.mapLayers.push(data));
  }

  public getLayers() {
    // Return an immutable copy instead of actual list...
    return this.layers;
  }

  public getMapLayers() {
    console.log('These are the layers for your map: ');
    console.log(this.mapLayers);
    // Return an immutable copy instead of actual list...
    return this.mapLayers;
  }
}
