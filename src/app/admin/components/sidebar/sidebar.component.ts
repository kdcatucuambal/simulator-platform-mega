import {Component, Input, OnInit} from '@angular/core';
import {SideBar} from "../layout/layout.component";



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

 @Input('data') sideBarData: SideBar[] = [];


  constructor(

  ) {
  }

  ngOnInit(): void {

  }

}
