import {Component, Input, OnInit} from '@angular/core';
import {AlertInfo} from "../../../models/AreaModel";
import {AuthService} from "../../../services/firestore/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input('title') title: string = '';
  @Input('alert') alert: AlertInfo;
  loggedIn = false;
  letterUser = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    console.log('header component')
    this.authService.isLogged.subscribe(value => {
      this.loggedIn = value;
      const {name, lastname} = this.authService.currentUserData;
      this.letterUser = name[0].toLocaleUpperCase() + lastname[0].toLocaleUpperCase();
    })
  }

  onLogout(){
    this.authService.logout().subscribe(()=>{
      this.router.navigateByUrl('/home');
    });
  }


}
