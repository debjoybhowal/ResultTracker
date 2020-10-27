import { ElementSchemaRegistry } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage.getItem('user_id')) {
      return this.loginService
        .login({
          username: localStorage.getItem('username'),
          pwd: localStorage.getItem('pwd'),
        })
        .pipe(
          map((item: any) => {
            if (item.code == 202) return true;
            else {
              console.log("INVALID USERNAME AND PASSWORD")
              localStorage.removeItem('username');
              localStorage.removeItem('user_id');
              localStorage.removeItem('pwd');
              this.router.navigate(['login']);
              return false;
            }
          })
        );
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
