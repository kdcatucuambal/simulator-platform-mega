import {Component, Input, OnInit} from '@angular/core';
import {AlertInfo} from "../../../models/AreaModel";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

@Input('title') title: string = '';
@Input('alert') alert: AlertInfo;

  constructor() { }

  ngOnInit(): void {
    console.log(this.alert)
  }

}
