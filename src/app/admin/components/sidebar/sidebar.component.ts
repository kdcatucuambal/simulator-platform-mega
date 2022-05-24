import {Component, Input, OnInit} from '@angular/core';
import {SideBar} from "../layout/layout.component";
import {AuthService} from "../../../services/firestore/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

 @Input('data') sideBarData: SideBar[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }

  onLogout(){
    this.authService.logout().subscribe(() => {
      window.location.href = '/login';
    })
  }

}
