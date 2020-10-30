import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermRoutingModule } from './term-routing.module';
import { TermComponent } from './term.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TermComponent],
  imports: [
    CommonModule,
    TermRoutingModule,
    NgApexchartsModule ,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TermModule { }
