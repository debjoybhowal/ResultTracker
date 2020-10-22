import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [DashComponent, HomeComponent, NavComponent, HeaderComponent],
  imports: [
    CommonModule,
    DashRoutingModule
  ]
})
export class DashModule { }
