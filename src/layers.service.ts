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
  private layerMapping: { [key: string]: any; } = { };  // Does the typing add anything ?
  private connector: Connector;

  constructor(private http: HttpClient) {
    this.connector = new LeafletConnector(http);
  }

  public addLayer(layer: BaseLayer) {
    const mapLayerPromise = this.connector.buildLayer(layer);

    this.layers.push(layer);

    mapLayerPromise.subscribe(mapLayer => {
      this.mapLayers.push(mapLayer)
      this.layerMapping[layer.id] = mapLayer;
    });
  }

  /**
   * These are the abstract representation of the layers.
   */
  public getLayers() {
    // Return an immutable copy instead of actual list...
    return this.layers;
  }

  /**
   * These are the layers for the map.
   */
  public getMapLayers() {

    // Return an immutable copy instead of actual list...
    return this.mapLayers;
  }

  public setLayerVisibility(layer: BaseLayer, active: boolean) {
    const mapLayer = this.layerMapping[layer.id];
    this.connector.setLayerVisibility(mapLayer, active, layer.type);
    layer.active = active;
  }
}
