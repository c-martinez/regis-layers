import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseLayer } from './layers/baselayer';
import { GeoJsonLayer } from './layers/geojsonlayer';
import { GroupLayer } from './layers/grouplayer';
import { ImageLayer } from './layers/imagelayer';
import { DynamicLayer } from './layers/dynamiclayer';
import { CircleLayer } from './layers/circlelayer';

import { Connector } from './connectors/base.connector';
import { LeafletConnector } from './connectors/leaflet.connector';

import { BackendService } from './backend.service';

@Injectable()
export class LayersService {
  private layers: BaseLayer[] = []; // Meta-data of the layer (generic)
  private mapLayers: any[] = [];    // Implementation specific layer (e.g. Leaflet Layer object) -- also holds markers
  private layerMapping: { [key: number]: any; } = {};  // Does the typing add anything ?
  private markerMapping: { [key: string]: any; } = {};
  private connector: Connector;
  public changeEmitter: EventEmitter<BaseLayer[]>;

  constructor(private http: HttpClient, private backend: BackendService) {
    this.connector = new LeafletConnector(http);
    this.changeEmitter = new EventEmitter();
    this.loadLayers();
  }

  public loadLayers(): void {
    this.backend.getLayerDefinitions().subscribe(
      defs => this.parseLayerDefinition(defs),
      error => {
        console.error('RegisLayerService: Error loading layer definition.');
        console.error(error);
      });
  }

  private parseLayerDefinition(defs: any) {
    // Hacky way to clear an array without destroy existing array -- it works.
    this.layers.length = 0;
    this.mapLayers.length = 0;

    for (let layer of defs['layers']) {
      try {
        let regisLayer: BaseLayer;
        switch (layer['type']) {
          case 'circle':
            regisLayer = new CircleLayer(layer.id, layer.name, layer.visible, layer.center, layer.radius);
            break;
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
   * @param virtual Whether this layer is `virtual` -- virtual layers exist
   * only temporarily (no persistent storage) and only on the map (not on list of layers).
   */
  public addLayer(layer: BaseLayer, virtual = false) {
    if (! virtual) {
      let req = this.backend.storeLayerDefinition(layer);
      req.subscribe(data => {
        console.log('RegisLayerService: got data from layer add post');
        console.log(data);
      });
    }

    this.displayLayer(layer, virtual);
  }

  public addMarker(lat: number, lng: number, draggable: boolean, name: string) {
    const marker = this.connector.buildMarker(lat, lng, draggable);
    this.mapLayers.push(marker);
    this.markerMapping[name] = marker;
    return marker;
  }

  public removeMarker(name: string) {
    const marker = this.markerMapping[name];

    const i = this.mapLayers.indexOf(marker);
    if (i !== -1) {
      this.mapLayers.splice(i, 1);
    }
  }

  public removeLayer(id: string) {
    const targetLayer = this.layerMapping[id];
    const index = this.mapLayers.indexOf(targetLayer);
    this.mapLayers.splice(index, 1);
  }

  /**
   * Adds layer to map / list of available layers. The layer is NOT added to the backend --
   * it is assumed that it was already added to the backend by some other means or that it
   * does not need to be added to the backend at all.
   *
   * @param layer abstract layer to be displayed.
   * @param virtual Whether this layer is `virtual` -- virtual layers exist
   * only temporarily (no persistent storage) and only on the map (not on list of layers).
   */
  public displayLayer(layer: BaseLayer, virtual = false) {
    const mapLayerPromise = this.connector.buildLayer(layer);

    if ( ! virtual) {
      this.layers.push(layer);
      this.changeEmitter.emit(this.layers);
    }

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
  public getLayers(): BaseLayer[] {
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
