import { Component, OnInit } from '@angular/core';
import {RandomSimulator, SimulatorInfo} from "../../../models/Models";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Card} from "../../components/card/card.component";


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

    this.queryDbService.getCollectionsWhere(
      [
        {collectionName: 'simulators', where: true, whereData: {field: 'isActive', operator: '==', value: true}},
        {collectionName: 'random-simulator', where: true, whereData: {field: 'isActive', operator: '==', value: true}}
      ]
    ).subscribe(data => {
      this.items =  (data[0] as SimulatorInfo[]).map<Card>(simulator => {
        return {
          backgroundColor: simulator.backgroundColor,
          id: simulator.id,
          imgUrl: simulator.imgUrl,
          isActive: simulator.isActive,
          description: simulator.description,
          path: `/simulador/${simulator.id}/default`,
          textColor: simulator.textColor,
          type: '',
          title: simulator.title,
          isCourse: false
        }
      });

      const rndSimulator = data[1] as RandomSimulator[];
      if (rndSimulator.length == 1){
        const simulator = rndSimulator[0];
        this.items.unshift({
          backgroundColor: simulator.backgroundColor,
          id: simulator.id,
          imgUrl: simulator.imgUrl,
          isActive: simulator.isActive,
          description: simulator.description,
          path: `/simulador/${simulator.id}/random`,
          textColor: simulator.textColor,
          type: '',
          title: simulator.title,
          isCourse: false
        });
      }


    })



  }

}
