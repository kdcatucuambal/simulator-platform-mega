import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Area} from "../../../models/AreaModel";
import {ValidateService} from "../../../services/validate/validate.service";




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  inputType = 'password';


  constructor(

  ) {

  }

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
