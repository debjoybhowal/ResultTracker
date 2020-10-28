import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { NgApexchartsModule } from "ng-apexcharts";


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule, 
    FormsModule, 
    ReactiveFormsModule,
    NgApexchartsModule
  ]
})
export class LoginModule { }
