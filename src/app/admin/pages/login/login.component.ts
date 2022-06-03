import {Component, OnInit} from '@angular/core';
import {ValidateService} from "../../../services/validate/validate.service";
import {AuthService} from "../../../services/firestore/auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  inputType = 'password';
  loading = false;
  submited = false;

  email = '';
  password = '';

  constructor(
    private validateService: ValidateService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
  }

  onLogin() {

    this.email = this.email.trim();
    this.password = this.password.trim();
    const isEmailValid = this.validateService.validateEmail(this.email);
    const isPasswordValid = this.password.length >= 6;

    if (!isEmailValid) {
      this.email = '';
      this.submited = true;
      return;
    }

    if (!isPasswordValid) {
      this.password = '';
      this.submited = true;
      return;
    }

    this.authService.login(this.email, this.password).subscribe(data => {

    })

  }

  onLogout(){
    this.authService.logout();
  }

  onShowPassword() {
    if (this.inputType == 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

  createAdmin() {
    this.authService.register({
      email: 'registromegapro@gmail.com',
      name: 'Megapro',
      phone: '099445455555',
      lastname: 'Admin',
      created: new Date(),
      password: 'plataforma_megapro2022',
      identificationCard: '10056210321',
      isActive: true,
      role: 'admin',
      observation: ''
    }).subscribe({
      next: (() => {

      }),
      error: (err) => {

      },
      complete: () => {

      }
    })
  }


}
