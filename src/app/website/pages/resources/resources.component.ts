import { Component, OnInit } from '@angular/core';
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Card} from "../../components/card/card.component";
import {Resource} from "../../../models/Models";

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  items: Card[]= [];

  constructor(
    private queryDbService: QueryDbService
  ) { }

  ngOnInit(): void {
    this.queryDbService
      .getDocsWhere<Resource>('resources', 'isActive', '==', true)
      .subscribe(data => {
        this.items = data.map<Card>(item => {
          return {
            backgroundColor: '',
            id: item.id,
            imgUrl: 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png',
            isActive: true,
            description: item.description,
            path: item.url,
            textColor: '',
            type: '',
            title: item.title,
            isCourse: false,
            isResource: true
          }
        });
      });
  }

}
