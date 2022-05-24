import {Component, Input, OnInit} from '@angular/core';
import {AlertInfo} from "../../../models/Models";
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
  isChecking = true;
  role = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.isLogged.subscribe(value => {
      this.loggedIn = value;
      this.isChecking = false;
      if (this.loggedIn) {
        const {name, lastname, role} = this.authService.currentUserData;
        this.role = role;
        this.letterUser = name[0].toLocaleUpperCase() + lastname[0].toLocaleUpperCase();
      }
    });

    this.checkUser();
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/inicio');
    });
  }

  checkUser() {
    const user = this.authService.currentUserData;
    if (user) {
      const {name, lastname} = user;
      this.letterUser = name[0].toLocaleUpperCase() + lastname[0].toLocaleUpperCase();
      this.loggedIn = true;
      this.isChecking = false;
    }
  }

}
