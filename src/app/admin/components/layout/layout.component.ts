import { Component, OnInit } from '@angular/core';
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Area} from "../../../models/AreaModel";

export interface SideBar {
  header: string,
  icon?: string
  options: {
    title: string,
    link: string,
    icon?: string
  }[]
}
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  sideBarData: SideBar[] = [
    {
      header: 'Textos',
      options: [
        {title: 'Temarios', link: 'topics'},
        {title: 'Subtemas', link: 'sub-topics'},
        {title: 'Cursos', link: 'courses'},
        {title: 'Carousel', link: 'carousel'},
        {title: 'Alerta', link: 'alerts'},
        {title: 'Títulos', link: 'titles'},
      ],
      icon: 'mx-2 bi bi-type'
    },
    {
      header: 'Simulador',
      options: [
        {title: 'Simuladores', link: 'simulators'}
      ],
      icon: 'mx-2 bi bi-laptop-fill'
    },
    {
      header: 'Recursos',
      options: [
        {title: 'Administrar', link: 'resources'}
      ],
      icon: 'mx-2 bi bi-laptop-fill'
    }
  ];

  loading = true;

  constructor(
    private queryDbService: QueryDbService
  ) { }

  ngOnInit(): void {
    this.queryDbService.getAllDocs<Area>('areas')
      .subscribe(topics=>{
        this.sideBarData.push({
          header: 'Preguntas',
          options: topics.map(t => {
            return {
              title: t.title,
              link: `questions/${t.id}`
            }
          }),
          icon: 'mx-2 bi bi-list-ol'
        });
        this.loading = false;
      })
  }

}
