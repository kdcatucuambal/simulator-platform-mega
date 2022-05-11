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


  constructor(

  ) { }

  ngOnInit(): void {


  }

}
