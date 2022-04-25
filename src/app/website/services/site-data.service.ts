import { Injectable } from '@angular/core';
import {QueryDbService} from "../../services/firestore/query-db.service";
import {BehaviorSubject, of, switchMap} from "rxjs";
import {AlertInfo, Area, Course, TitleInfo} from "../../models/AreaModel";
import {Card} from "../components/card/card.component";
export interface TitleModel{
  info_title: TitleInfo,
  courses_title: TitleInfo,
  info_title_2: TitleInfo,
  info_title_1: TitleInfo,
  footer_info_1: TitleInfo,
  footer_info_2: TitleInfo,
  main_title: TitleInfo,
  syllabus_title: TitleInfo,
  footer_title_2: TitleInfo,
  footer_title_1: TitleInfo
}
@Injectable({
  providedIn: 'root'
})
export class SiteDataService {


  private titles_ = new BehaviorSubject<TitleModel>({} as TitleModel);
  private loading = new BehaviorSubject<boolean>(true);
  private courses = new BehaviorSubject<Card[]>([]);
  private topics = new BehaviorSubject<Card[]>([])

  private alert: AlertInfo = {} as AlertInfo;

  constructor(
    private queryDbService: QueryDbService
  ) {
    this.queryDbService
      .getCollections(['titles', 'areas', 'courses', 'alerts'])
      .subscribe(data => {

        const titles: TitleModel = (data[0] as any).reduce((a, v)=> ({...a, [v.type]: v}), {});
        this.titles_.next(titles);

        const topics = (data[1] as Card[]).map(topic => {
          topic.isCourse = false;
          return topic;
        });
        this.topics.next(topics);
        this.topics.complete();

        const courses =  (data[2] as Card[]).map(course => {
          course.isCourse = true;
          return course;
        });
        this.courses.next(courses);
        this.courses.complete();

        this.alert = (data[3] as AlertInfo[])[0];

        this.loading.next(false);
        this.loading.complete();



        console.log('Data Service')
      })
  }


  get loadingValue(){
    return this.loading.asObservable();
  }

  get courseList(){
    return this.courses.getValue();
  }

  get topicList(){
    return this.topics.getValue();
  }

  get titles(){
    return this.titles_.getValue();
  }

  get alertValue(){
    return this.alert;
  }


}
