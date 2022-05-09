import { Component, OnInit } from '@angular/core';
import {SimulatorInfo} from "../../../models/AreaModel";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Card} from "../../components/card/card.component";
import {AuthService} from "../../../services/firestore/auth.service";

@Component({
  selector: 'app-simulators-info',
  templateUrl: './simulators-info.component.html',
  styleUrls: ['./simulators-info.component.scss']
})
export class SimulatorsInfoComponent implements OnInit {

  items: Card[] = [];

  constructor(
    private queryDbService: QueryDbService
  ) { }

  ngOnInit(): void {
    this.queryDbService
      .getDocsWhere<SimulatorInfo>('simulators', 'isActive', '==', true)
      .subscribe(data => {
        this.items =  data.map<Card>((simulator)=>{
          return {
            backgroundColor: simulator.backgroundColor,
            id: simulator.id,
            imgUrl: simulator.imgUrl,
            isActive: simulator.isActive,
            description: simulator.description,
            path: `/simulador/${simulator.id}`,
            textColor: simulator.textColor,
            type: '',
            title: simulator.title,
            isCourse: false
          }
        })
      })
  }

}
