import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import 'rxjs/add/operator/map';

import { tileLayer, latLng, Layer, geoJSON, polygon, circle, layerGroup } from 'leaflet';

import { Connector } from './base.connector';
import { BaseLayer } from '../layers/baselayer';
import { GeoJsonLayer } from '../layers/geojsonlayer';

export class LeafletConnector extends Connector {
    constructor(private http: HttpClient) {
        super();
    }

    public buildLayer(layer: BaseLayer) {
        let leafletLayer: any = 'None';
        switch (layer.type) {
            case 'circle':
                // leafletLayer = 'build a circle...';
                leafletLayer =  circle([44.8, -121.85], { radius: 10000, opacity: 1 });
                leafletLayer = Observable.of(leafletLayer);
                break;
            case 'polygon':
                leafletLayer = polygon([[46.8, -121.85], [46.92, -121.92], [46.87, -121.8]]);
                leafletLayer = Observable.of(leafletLayer);
                break;
            case 'geojson':
                const geojsonLayer = <GeoJsonLayer>layer;
                leafletLayer = this.http.get(geojsonLayer.url)
                    .map((res: Response) => this.buildGeoJson(res));
                break;
        }
        return leafletLayer;
    }

    private buildGeoJson(geoDataNew) {
        // By default, uset properties as styling -- may not be the best approach.
        const geoStyle = {
            style: (feature) => (feature.properties)
        };

        return geoJSON(geoDataNew, geoStyle);
    }
}
