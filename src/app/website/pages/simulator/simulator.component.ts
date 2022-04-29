import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {of, switchMap} from "rxjs";

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit {

  simulatorId = '';
  show = false;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.simulatorId = params.get('id');
        return of([]);
      })
    ).subscribe((data) => {

    });
  }


  onSidebar(){
    this.show = !this.show;
    if (this.show){
      this.closeNav();
    }else{
      this.openNav();
    }
  }

  openNav(){
    document.getElementById("mySidebar")!.style.width = "300px";
    document.getElementById("main")!.style.marginLeft = "300px";
  }

  closeNav(){
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft= "0";
  }

}
