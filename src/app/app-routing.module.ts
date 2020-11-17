import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'dash',
    canActivate:[LoginGuard],
    loadChildren: () => import('./dash/dash.module').then((m) => m.DashModule),
  },
  {
    path:'intro',
    component:IntroComponent
  },
  {
    path: '',
    redirectTo: '/dash/home',
    pathMatch:'full'
  },
  {
    path        : '**',
    pathMatch   : 'full',    
    redirectTo: '/dash/home',
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
