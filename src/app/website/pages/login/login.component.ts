import {Component, OnInit} from '@angular/core';
import {TestLayoutService} from "../../services/test-layout.service";
import {User} from "../../../models/AreaModel";
import {AuthService} from "../../../services/firestore/auth.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  inputType = 'password';
  email = '';
  password = '';
  submited = false;
  loginError = false;
  loading = false;


  constructor(
    private authService: AuthService,
    private validateService: ValidateService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    console.log('loginComponent')
  }

  onShowPassword() {
    if (this.inputType == 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

  onLogin() {
    this.email = this.email.trim();
    this.password = this.password.trim();
    this.loading = true;
    if (!this.validateService.validateEmail(this.email)) {
      this.submited = true;
      this.loading = false;
      this.email = '';
      return;
    }

    if (this.password.length < 6) {
      this.submited = true;
      this.loading = false;
      this.password = '';
      return;
    }

    this.authService.login(this.email, this.password)
      .subscribe({
        next: () => {
          this.submited = false;
          this.loading = false;
          this.router.navigateByUrl('/inicio').then();
        },
        error: (err) => {
          this.loginError = true;
          this.submited = true;
          this.password = '';
          this.loading = false;
          this.email = '';
        },
        complete: () => {
          console.log('Completed')
        }
      })

  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      console.log('logout')
    })
  }

}
