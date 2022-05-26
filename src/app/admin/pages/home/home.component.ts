import { Component, OnInit } from '@angular/core';
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Observable, switchMap} from "rxjs";
import {Area} from "../../../models/Models";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sizes: number[] = null;

  constructor(
    private queryDbService: QueryDbService
  ) {
  }

  ngOnInit(): void {
    this.queryDbService.
    getCollectionsSize(['users', 'resources', 'courses', 'simulators'])
      .pipe(
        switchMap<number[], Observable<Area[]>>(data => {
          this.sizes = data;
          return this.queryDbService.getAllDocs('areas');
        })
      )
      .subscribe(data => {
        this.sizes.push(data.length);
        let questionsSize = 0;
        for (const item of data) {
          questionsSize += item.questions;
        }
        this.sizes.push(questionsSize);
    })
  }

  onSidebar(value: boolean){
    if (value){
      this.openNav();
    }else{
      this.closeNav();
    }
  }

  openNav(){
    document.getElementById("mySidebar")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }

  closeNav(){
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft= "0";
  }

}
