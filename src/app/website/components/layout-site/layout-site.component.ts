import { Component, OnInit } from '@angular/core';
import {SiteDataService} from "../../services/site-data.service";
import {AlertInfo} from "../../../models/AreaModel";




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
    private siteDataService: SiteDataService
  ) { }

  ngOnInit(): void {
    this.siteDataService.loadingValue.subscribe(value =>{
      if (!value){
        this.mainTitle = this.siteDataService.titles.main_title.value;
        this.alert = this.siteDataService.alertValue;
        this.loading = false;
      }
    }
    )
  }

}
