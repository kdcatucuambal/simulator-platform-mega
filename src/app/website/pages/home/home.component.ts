import { Component, OnInit } from '@angular/core';
import {CarouselItem} from "../../components/carousel/carousel.component";
import {Card} from "../../components/card/card.component";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {SiteDataService, TitleModel} from "../../services/site-data.service";




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  carouselItems: CarouselItem[];



  topicsCard: Card[] = [];
  coursesCard: Card[] = [];
  isAlert: boolean = false;


  titles: TitleModel = {} as TitleModel;


  constructor(
    private queryDbService: QueryDbService,
    private siteDataService: SiteDataService
  ) {
    this.carouselItems = [
      {
        title: 'Title 1',
        subtitle: 'Subtitle 1',
        imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmfKBoxRxCSt4xQQ3YOOI4YUBId5FVuJzOGA&usqp=CAU'
      },
      {
        title: 'Title 2',
        subtitle: 'Subtitle 2',
        imgUrl: 'https://www.processmaker.com/wp-content/uploads/2019/10/dreamstime_xxl_146173544-768x538.jpg'
      },
      {
        title: 'Accede a la Educación Superior',
        subtitle: 'Nuestros cursos son super especializados y lograrás obtener un cupo asegurado en una Universidad o Instittuo del país. Nuestros cursos son super especializados y lograrás obtener un cupo asegurado en una Universidad o Instittuo del país.',
        imgUrl: 'https://seduc.edomex.gob.mx/sites/seduc.edomex.gob.mx/files/images/padres_familia/inscripciones_superior/cambio%20seduc%20padres%20de%20familia_inscripciones%20a%20superior.jpg'
      }
    ]

  }

  ngOnInit(): void {

    // this.queryDbService.getCollections(['areas', 'courses', 'titles'])
    //   .subscribe(data => {
    //
    //     this.topicsCard = (data[0] as Card[]).map(topic => {
    //       topic.isCourse = false;
    //       return topic;
    //     });
    //
    //     this.coursesCard = (data[1] as Card[]).map(course => {
    //       course.isCourse = true;
    //       return course;
    //     });
    //
    //     this.titles = (data[2] as any).reduce((a, v)=> ({...a, [v.type]: v}), {});
    //
    //
    //   })

    this.coursesCard = this.siteDataService.courseList;
    this.topicsCard = this.siteDataService.topicList;
    this.titles = this.siteDataService.titles;
    this.isAlert = this.siteDataService.alertValue.isActive;

  }

}
