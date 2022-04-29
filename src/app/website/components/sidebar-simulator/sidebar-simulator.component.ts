import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-simulator',
  templateUrl: './sidebar-simulator.component.html',
  styleUrls: ['./sidebar-simulator.component.scss']
})
export class SidebarSimulatorComponent implements OnInit {

  items:number[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log('hello')
    for (let i = 0; i < 105; i++) {
      this.items.push(i + 1);
    }
  }



}


