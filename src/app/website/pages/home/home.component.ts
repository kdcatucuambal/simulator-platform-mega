import { Component, OnInit } from '@angular/core';
import {CarouselItem} from "../../components/carousel/carousel.component";
import {Card} from "../../components/card/card.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  carouselItems: CarouselItem[];
  loading = false;
  cardsInfo: Card[] = [
    {
      title: 'Razonamiento Numérico',
      description: 'Realiza operaciones matemáticas y preparate para el test transformar.',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/3074/3074046.png',
      isCourse: false
    },
    {
      title: 'Razonamiento Verbal',
      description: 'Uno de los mejores contenidos para que puedas prácticar',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/3616/3616595.png',
      isCourse: false
    },
    {
      title: 'Razonamiento Lógico',
      description: 'Realiza operaciones matemáticas y preparate para el test transformar.',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/2958/2958882.png',
      isCourse: false
    },
    {
      title: 'Atención y concentración',
      description: 'Uno de los mejores contenidos para que puedas prácticar',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://cdn-icons-png.flaticon.com/512/6604/6604292.png',
      isCourse: false
    },
  ];


  coursesInfo: Card[] = [
    {
      title: 'MEGAU 1B -  TEST TRANSFORMAR',
      description: 'Virtual - Martes y Jueves de 19h00 a 21h00.',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://megapro.com.ec/site/images/course_4.jpg',
      isCourse: true
    },
    {
      title: 'MEGAU 2 -  TEST TRANSFORMAR',
      description: 'Virtual - Martes y Jueves de 19h00 a 21h00.',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://megapro.com.ec/site/images/course_5.jpg',
      isCourse: true
    },
    {
      title: 'MEGAU 3 -  TEST TRANSFORMAR',
      description: 'Virtual - Martes y Jueves de 19h00 a 21h00.',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://megapro.com.ec/site/images/course_1.jpg',
      isCourse: true
    },
    {
      title: 'MEGAU ESPOL -  PRE POLITÉCNICO',
      description: 'Presencial - Martes y Jueves de 19h00 a 21h00.',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://megapro.com.ec/site/images/course_2.jpg',
      isCourse: true
    },
    {
      title: 'MEGAU TUTORÍAS -  CLASES PARTICULARES',
      description: 'Presencial - Martes y Jueves de 19h00 a 21h00.',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      imgUrl: 'https://megapro.com.ec/site/images/course_6.jpg',
      isCourse: true
    }
  ];

  constructor() {
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
    setTimeout(()=>{
      this.loading = false;
    }, 5000)
  }

}
