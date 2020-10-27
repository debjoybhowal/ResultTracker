import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgCircleProgressModule } from 'ng-circle-progress';


@NgModule({
  declarations: [DashComponent, HomeComponent, NavComponent, HeaderComponent],
  imports: [
    CommonModule,
    DashRoutingModule,
    NgApexchartsModule,
    NgCircleProgressModule.forRoot({
      "backgroundColor": "#F1F1F1",
      "backgroundPadding": -18,
      "radius": 60,
      "toFixed": 2,
      "titleFontSize":"30",
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#FF6347",
      "innerStrokeColor": "#32CD32",
      "innerStrokeWidth": 1,
      "showSubtitle":false,
      "startFromZero": false})
  ]
})
export class DashModule { }
