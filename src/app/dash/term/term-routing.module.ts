import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermComponent } from './term.component';

const routes: Routes = [{ path: '', component: TermComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermRoutingModule { }
