import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashComponent } from './dash.component';

const routes: Routes = [
  {
    path: '',
    component: DashComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        pathMatch: 'full',
      },{
        path: 'term/:id',
        loadChildren: () =>
          import('./term/term.module').then((m) => m.TermModule),
        pathMatch: 'full',
      },
      {
        path: 'term',
        loadChildren: () =>
          import('./term/term.module').then((m) => m.TermModule),
        pathMatch: 'full',
      },
      {
        path: 'subject',
        loadChildren: () =>
          import('./subject/subject.module').then((m) => m.SubjectModule),
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: '/dash/home',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashRoutingModule {}
