import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseLayer } from './layers/baselayer';
import { GeoJsonLayer } from './layers/geojsonlayer';
import { GroupLayer } from './layers/grouplayer';
import { ImageLayer } from './layers/imagelayer';
import { DynamicLayer } from './layers/dynamiclayer';

import { Connector } from './connectors/base.connector';
import { LeafletConnector } from './connectors/leaflet.connector';

import { BackendService } from './backend.service';

@Injectable()
export class LayersService {
  private layers: BaseLayer[] = []; // Meta-data of the layer (generic)
  private mapLayers: any[] = [];    // Implementation specific layer (e.g. Leaflet Layer object)
  private layerMapping: { [key: string]: any; } = {};  // Does the typing add anything ?
  private connector: Connector;

  constructor(private http: HttpClient, private backend: BackendService) {
    this.connector = new LeafletConnector(http);

    backend.getLayerDefinitions().subscribe(
        defs => this.parseLayerDefinition(defs),
        error => {
          console.error('RegisLayerService: Error loading layer definition.');
          console.error(error);
        });
  }

  private parseLayerDefinition(defs: any) {
    for (let layer of defs['layers']) {
      try {
        let regisLayer: BaseLayer;
        switch (layer['type']) {
          case 'geojson':
            regisLayer = new GeoJsonLayer(layer.id, layer.name, layer.visible, layer.url);
            break;
          case 'group':
            regisLayer = new GroupLayer(layer.id, layer.name, layer.visible, layer.url);
            break;
          case 'image':
            regisLayer = new ImageLayer(layer.id, layer.name, layer.visible, layer.url, layer.bounds);
            break;
          case 'dynamic':
            regisLayer = new DynamicLayer(layer.id, layer.name, layer.visible, layer.url);
            break;
          default:
            console.error('RegisLayersService: unknown layer definition: ');
            console.error(layer['type']);
        }
        if (regisLayer) {
          this.displayLayer(regisLayer);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Creates a new layer (adds it to the definition of layers on backend) and adds
   * the newly created layer to the list of layers to be visualized on the map.
   * @param layer Abstract layer to be added to layer service.
   */
  public addLayer(layer: BaseLayer) {
    console.log('RegisLayerService: Should add layer to backend storage...');
    let req = this.backend.storeLayerDefinition();
    req.subscribe(data => {
      console.log('RegisLayerService: got data from layer add post');
      console.log(data);
    });

    this.displayLayer(layer);
  }

  /**
   * Adds layer to map / list of available layers.
   * @param layer abstract layer to be displayed.
   */
  private displayLayer(layer: BaseLayer) {
    const mapLayerPromise = this.connector.buildLayer(layer);

    this.layers.push(layer);

    mapLayerPromise.subscribe(
      mapLayer => {
        this.mapLayers.push(mapLayer)
        this.layerMapping[layer.id] = mapLayer;
      },
      error => {
        console.error('RegisLayerService: Error building layer:');
        console.error(error);
      }
    );
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

  /**
   * Hide/show layer.
   * @param layer Abstract layer to hide/show
   * @param active true: show / false: hide
   */
  public setLayerVisibility(layer: BaseLayer, active: boolean) {
    const mapLayer = this.layerMapping[layer.id];
    this.connector.setLayerVisibility(mapLayer, active, layer.type);
    layer.active = active;
  }
}
