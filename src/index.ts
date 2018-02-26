import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SampleComponent } from './sample.component';
// import { SampleDirective } from './sample.directive';
// import { SamplePipe } from './sample.pipe';

// export * from './sample.component';
// export * from './sample.directive';
// export * from './sample.pipe';
export { LayersService } from './layers.service';
export { BackendService } from './backend.service';

export { GeoJsonLayer } from './layers/geojsonlayer';
export { GroupLayer } from './layers/grouplayer';
export { ImageLayer } from './layers/imagelayer';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
//    SampleComponent,
//    SampleDirective,
//    SamplePipe
  ],
  exports: [
//    SampleComponent,
//    SampleDirective,
//    SamplePipe
  ]
})
export class RegisLayersModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RegisLayersModule,
      providers: []
    };
  }
}
