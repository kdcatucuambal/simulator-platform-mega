import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {firstValueFrom, Observable} from 'rxjs';
import {AuthService} from "../services/firestore/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }


  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    const user = await firstValueFrom(this.authService.getCurrentUser());
    console.log(user)
    const userData = this.authService.currentUserData;


    if(user &&
      user.email == 'registromegapro@gmail.com' &&
      userData.role == 'admin'){
      return true;
    }
    this.router.navigateByUrl('/inicio').then();
    return false;
  }

}
