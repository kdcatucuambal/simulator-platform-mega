import { Component, OnInit } from '@angular/core';
import {Card} from "../../components/card/card.component";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Area, RandomSimulator, SimulatorInfo} from "../../../models/Models";

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {

  items: Card[] = [];
  text = '';

  constructor(
    private queryDbService: QueryDbService
  ) { }

  ngOnInit(): void {

    this.queryDbService.getCollectionsWhere([
      {collectionName: 'areas', where: true, whereData: {field: 'isActive', operator: '==', value: true}},
      {collectionName: 'titles', where: true, whereData: {field: 'type', operator: '==', value: 'info_topics'}}
    ]).subscribe(data => {
     this.items =  (data[0] as Area[]).map<Card>(topic => {
        return {
          backgroundColor: topic.backgroundColor,
          id: topic.id,
          imgUrl: topic.imgUrl,
          isActive: topic.isActive,
          description: topic.description,
          path: `/practicar/${topic.id}`,
          textColor: topic.textColor,
          type: '',
          title: topic.title,
          isCourse: false
        }
      });

     const values = data[1] as any[];
     this.text = values[0]['value'];

    })

    this.queryDbService
      .getDocsWhere<Area>('areas', 'isActive', '==', true)
      .subscribe(data => {
        this.items = data.map<Card>(topic => {
          return {
            backgroundColor: topic.backgroundColor,
            id: topic.id,
            imgUrl: topic.imgUrl,
            isActive: topic.isActive,
            description: topic.description,
            path: `/practicar/${topic.id}`,
            textColor: topic.textColor,
            type: '',
            title: topic.title,
            isCourse: false
          }
        })
      });


  }

}
