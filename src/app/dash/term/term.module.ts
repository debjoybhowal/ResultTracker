import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermRoutingModule } from './term-routing.module';
import { TermComponent } from './term.component';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [TermComponent],
  imports: [
    CommonModule,
    TermRoutingModule,
    NgApexchartsModule 
  ]
})
export class TermModule { }
