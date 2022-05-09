import { Component, OnInit } from '@angular/core';
import {AlertInfo} from "../../../models/AreaModel";
import {TestLayoutService} from "../../services/test-layout.service";
import {findIndex, map, skip} from "rxjs";
import {QueryDbService} from "../../../services/firestore/query-db.service";




@Component({
  selector: 'app-layout-site',
  templateUrl: './layout-site.component.html',
  styleUrls: ['./layout-site.component.scss']
})
export class LayoutSiteComponent implements OnInit {

  loading = true;


  mainTitle = '';
  alert: AlertInfo = {} as AlertInfo;

  constructor(
    private testService: TestLayoutService,
    private queryDbService: QueryDbService
  ) { }

  ngOnInit(): void {

    this.queryDbService.getAllDocs('titles').subscribe(data => {
      console.log(data)
      this.loading = false;
    });

    console.log('layout')

    this.testService.isChanged
      .pipe(skip(1))
      .subscribe(data => {
      console.log('service emit: ', data)
      this.loading = data;
    });

  }

}
