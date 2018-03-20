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

    public storeLayerDefinition(layerDef) {
        const layerServiceUrl = this.baseUrl + 'layers/add/';

        console.log('RegisLayerService: url: ' + layerServiceUrl);
        const formData = new FormData();
        for (let key in layerDef) {
            if (layerDef.hasOwnProperty(key)) {
                formData.append(key, layerDef[key]);
            }
        }

        return this.http.post(layerServiceUrl, formData);
    }
}

export interface LayersDef {
  layers: object[];
  name: string;
  version: string;
}
