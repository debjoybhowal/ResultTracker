import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgCircleProgressModule } from 'ng-circle-progress';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgApexchartsModule,
    NgCircleProgressModule.forRoot({
      "backgroundColor": "#FFFFFF",
      "backgroundPadding": -18,
      "radius": 60,
      "toFixed": 1,
      "titleFontSize":"28",
      "outerStrokeWidth": 10,
      "innerStrokeWidth": 1,
      "showSubtitle":false,
      "startFromZero": false})
  ]
})
export class HomeModule { }
