import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { tileLayer, latLng, Layer, LayerGroup, geoJSON, polygon, circle, layerGroup, imageOverlay } from 'leaflet';

import { Connector } from './base.connector';
import { BaseLayer } from '../layers/baselayer';
import { GeoJsonLayer } from '../layers/geojsonlayer';
import { GroupLayer } from '../layers/grouplayer';
import { ImageLayer } from '../layers/imagelayer';

export class LeafletConnector extends Connector {
    private defaultStyle = {
        opacity: 1,
        fillOpacity: 0.5
    };

    constructor(private http: HttpClient) {
        super();
    }

    public buildLayer(layer: BaseLayer): Layer {
        let leafletLayer: Layer = 'None';
        switch (layer.type) {
            case 'circle':
                // leafletLayer = 'build a circle...';
                let radius = 10000;
                leafletLayer = circle([44.8, -121.85], radius, this.defaultStyle);
                leafletLayer = Observable.of(leafletLayer);
                break;
            case 'polygon':
                leafletLayer = polygon([[46.8, -121.85], [46.92, -121.92], [46.87, -121.8]], this.defaultStyle);
                leafletLayer = Observable.of(leafletLayer);
                break;
            case 'geojson':
                const geojsonLayer = <GeoJsonLayer> layer;
                leafletLayer = this.http.get(geojsonLayer.url)
                    .map((res: Response) => this.buildGeoJson(res));
                break;
            case 'group':
                const groupLayer = <GroupLayer> layer;
                leafletLayer = this.http.get(groupLayer.dataSource)
                    .map((res: Response) => this.buildGroupLayer(res));
                break;
            case 'image':
                const imageLayer = <ImageLayer> layer;
                leafletLayer = imageOverlay(imageLayer.dataSource, imageLayer.bounds /*[[42, -100], [40, -110]]*/);
                leafletLayer = Observable.of(leafletLayer);
                break;
            default:
                console.log('RegisLeafletConnector: unknown layer type: ' + layer.type);
        }
        return leafletLayer;
    }

    private buildGeoJson(geoDataNew) {
        // By default, uset properties as styling
        const geoStyle = {
            style: (feature) => (feature.properties)
        };
        let geoLayer = geoJSON(geoDataNew, geoStyle);
        geoLayer.options.defaultStyle = geoStyle.style;
        return geoLayer;
    }

    private buildGroupLayer(groupDef): LayerGroup {
        const KM = 1000;
        let layers = [];
        for (let item of groupDef['items']) {
            switch (item.type) {
                case 'circle':
                    const myCircle = circle(item.center, item.radius * KM, item.properties);
                    myCircle.options.defaultStyle = item.properties;
                    layers.push(myCircle);
                    break;
                default:
                    console.log('RegisLeafletConnector: unknown group-layer type for ' + item);
            }
        }
        return layerGroup(layers);
    }

    public setLayerVisibility(leafletLayer: Layer, active: boolean, type: string) {
        const styleHidden = {
            opacity:     0.0,
            fillOpacity: 0.0
        };
        let newStyle: any;
        switch (type) {
            case 'circle':
            case 'polygon':
                newStyle = active ? this.defaultStyle : styleHidden;
                leafletLayer.setStyle(newStyle);
                break;
            case 'group_item':
            case 'geojson':
                newStyle = active ? leafletLayer.options.defaultStyle : styleHidden;
                leafletLayer.setStyle(newStyle);
                break;
            case 'group':
                for (let leafLay of leafletLayer.getLayers()) {
                    console.log(leafLay);
                    this.setLayerVisibility(leafLay, active, 'group_item');
                }
                break;
            case 'image':
                leafletLayer.setOpacity(active ? 1.0 : 0.0);
                break;
            default:
                console.log('RegisLeafletConnector: Unknown layer visibility for ' + type);
        }
    }
}
