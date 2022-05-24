import {Component, OnInit} from '@angular/core';
import {Card} from "../../components/card/card.component";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {AlertInfo, Area, CarouselInfo} from "../../../models/Models";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  carouselItems: CarouselInfo[] = [];


  topicsCard: Card[] = [];
  coursesCard: Card[] = [];
  alert: AlertInfo = null;
  loading = true;

  titles: any = null;

  constructor(
    private queryDbService: QueryDbService,
  ) {

  }

  ngOnInit(): void {

    this.queryDbService.getCollectionsWhere([
        {collectionName: 'titles', where: false},
        {collectionName: 'areas', where: true, whereData: {field: 'isActive', operator: '==', value: true}},
        {collectionName: 'courses', where: true, whereData: {field: 'isActive', operator: '==', value: true}},
        {collectionName: 'alerts', where: true, whereData: {field: 'isActive', operator: '==', value: true}},
        {collectionName: 'carousel', where: true, whereData: {field: 'isActive', operator: '==', value: true}}
      ]
    ).subscribe(data => {
      this.titles = (data[0] as any).reduce((a, v) => ({...a, [v.type]: v}), {});

      this.topicsCard = (data[1] as Area[]).map<Card>(topic => {
        const path = `/practicar/${topic.id}`;
        return {
          title: topic.title,
          description: topic.description,
          isCourse: false,
          path,
          backgroundColor: topic.backgroundColor,
          type: 'course',
          imgUrl: topic.imgUrl,
          isActive: topic.isActive,
          textColor: topic.textColor
        };
      });

      this.coursesCard = (data[2] as Card[]).map(course => {
        course.isCourse = true;
        return course;
      });

      this.alert = ((data[3] as AlertInfo[])[0]);

      this.carouselItems = ((data[4] as CarouselInfo[]));

      this.loading = false;
    });


  }

}
