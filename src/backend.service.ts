import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BackendService {
    private baseUrl = 'http://localhost:4201/';

    constructor(private http: HttpClient) {
        console.log('RegisLayerBackendService: baseurl should come from config.');
        console.log('RegisLayerBackendService: using: ' + this.baseUrl);
    }

    public getLayerDefinitions() {
        const layerServiceUrl = this.baseUrl + 'layers/';
        // const layerServiceUrl = 'http://localhost:4200/assets/layerdefinitions.json';
        console.log('RegisLayerService: url: ' + layerServiceUrl);

        return this.http.get<LayersDef>(layerServiceUrl);
    }

    public storeLayerDefinition() {
        const layerServiceUrl = this.baseUrl + 'layers/add/';
        // const layerServiceUrl = 'http://localhost:4200/assets/layerdefinitions.json';
        console.log('RegisLayerService: url: ' + layerServiceUrl);
        const defData = {
            data: 'someData',
            format: 'json',
            source: 'random'
        };

        return this.http.post(layerServiceUrl, defData);
    }
}

export interface LayersDef {
  layers: object[];
  name: string;
  version: string;
}
