import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';
<<<<<<< HEAD
import { NgCircleProgressModule } from 'ng-circle-progress';
=======
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgCircleProgressModule } from 'ng-circle-progress';

>>>>>>> 6079c1d4a3391058481e04ca04e85a4a44b21a60

@NgModule({
  declarations: [DashComponent, HomeComponent, NavComponent, HeaderComponent],
  imports: [
    CommonModule,
    DashRoutingModule,
<<<<<<< HEAD
=======
    NgApexchartsModule,
>>>>>>> 6079c1d4a3391058481e04ca04e85a4a44b21a60
    NgCircleProgressModule.forRoot({
      "backgroundColor": "#F1F1F1",
      "backgroundPadding": -18,
      "radius": 60,
      "toFixed": 1,
      "titleFontSize":"28",
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#FF6347",
      "innerStrokeColor": "#32CD32",
      "innerStrokeWidth": 1,
      "showSubtitle":false,
      "startFromZero": false})
  ]
})
export class DashModule { }
