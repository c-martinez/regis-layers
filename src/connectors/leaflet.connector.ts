import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { tileLayer, latLng, Layer, LayerGroup, geoJSON, circle, layerGroup, imageOverlay, Marker, Icon } from 'leaflet';

import { Connector } from './base.connector';
import { BaseLayer } from '../layers/baselayer';
import { GeoJsonLayer } from '../layers/geojsonlayer';
import { GroupLayer } from '../layers/grouplayer';
import { ImageLayer } from '../layers/imagelayer';
import { DynamicLayer } from '../layers/dynamiclayer';
import { CircleLayer } from '../layers/circlelayer';

export class LeafletConnector extends Connector {
    private defaultStyle = {
        opacity: 1,
        fillOpacity: 0.5
    };
    private transparentStyle = {
        weight: 1,
        color: '#000000',
        opacity: 1,
        fillOpacity: 0.0
    };
    private myDynamicLayerData;

    constructor(private http: HttpClient) {
        super();
    }

    public buildMarker(lat: number, lng: number, draggable: boolean) {
        const iconWidth = 25;   // known size of ./assets/marker-icon.png
        const iconHeight = 41;
        const icon = new Icon({
            iconUrl: './assets/marker-icon.png',
            iconSize:   [iconWidth     , iconHeight],
            iconAnchor: [iconWidth / 2 , iconHeight],
        });
        const marker = new Marker([ lat, lng], {
            icon: icon,
            draggable: draggable
        });
        return marker;
    }

    public buildLayer(layer: BaseLayer): Layer {
        let leafletLayer: Layer = 'None';
        switch (layer.type) {
            case 'circle':
                const circleLayer = <CircleLayer> layer;
                leafletLayer = circle(circleLayer.center, circleLayer.radius, this.transparentStyle);
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
            case 'dynamic':
                const dynamicLayer = <DynamicLayer> layer;
                leafletLayer = this.buildDynamicLayer();
                leafletLayer = Observable.of(leafletLayer);
                break;
            default:
                console.log('RegisLeafletConnector: unknown layer type: ' + layer.type);
        }
        return leafletLayer;
    }

    private dynamicLayerTick() {
        // this.myDynamicLayerData.layer.clearLayers();

        let center = this.myDynamicLayerData.circle.getLatLng();

        const slices = 36;
        this.myDynamicLayerData.counter += 1;
        if (this.myDynamicLayerData.counter === slices) {
            this.myDynamicLayerData.counter = 0;
        }

        const angle = 2 * Math.PI / slices * this.myDynamicLayerData.counter;

        center.lat += Math.cos(angle);
        center.lng += Math.sin(angle);

        this.myDynamicLayerData.circle.setLatLng(center);
    }

    private buildDynamicLayer(): LayerGroup {
        let center = [45, -50];
        const radius = 150;
        let myCircle = circle(center, radius * 1000, {
            color: '#000000', fillColor: '#ffed6f'
        });
        let myLayer = layerGroup()
        myLayer.addLayer(myCircle);

        setInterval(() => {
            this.dynamicLayerTick();
        }, 500);

        this.myDynamicLayerData = {
            counter: 0,
            layer: myLayer,
            circle: myCircle
        };
        return this.myDynamicLayerData.layer;
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
                newStyle = active ? this.transparentStyle : styleHidden;
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
