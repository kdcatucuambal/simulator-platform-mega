import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  inputType = 'password';

  constructor() { }

  ngOnInit(): void {
  }

  onShowPassword(){
    if (this.inputType == 'password'){
      this.inputType = 'text';
    }else{
      this.inputType = 'password';
    }
  }

}
