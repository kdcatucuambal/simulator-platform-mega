import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, ignoreElements, map, Observable} from 'rxjs';
import {AuthService} from "../services/firestore/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
    ) {

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {

    const user = await firstValueFrom(this.authService.getCurrentUser());

    if (!user){
      this.router.navigateByUrl('/login').then();
      return false;
    }

    return true;
  }

}
