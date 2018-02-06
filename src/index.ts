import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SampleComponent } from './sample.component';
// import { SampleDirective } from './sample.directive';
// import { SamplePipe } from './sample.pipe';
import { LayersService } from './layers.service';

// export * from './sample.component';
// export * from './sample.directive';
// export * from './sample.pipe';
export * from './layers.service';

export { GeoJsonLayer } from './layers/geojsonlayer';

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
      providers: [LayersService]
    };
  }
}
