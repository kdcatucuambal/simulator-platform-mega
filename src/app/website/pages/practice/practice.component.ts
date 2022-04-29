import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {of, switchMap} from "rxjs";


interface TestQuestion {
  description: string,
  options: string[],
  correct: number
}

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {

   topicId = '';

  questions: TestQuestion[] = [
    {
      description: '<p>¿Calcular la <strong>suma</strong> de 1 + 1 mija?</p>',
      options: ['1', '2', '3', '4'],
      correct: 3
    },
    {
      correct: 1,
      options: ['<p>12 dólares</p>', '<p>15 dólares</p>', '<p>16 dólares</p>', '<p>19 dólares</p>'],
      description: '<p>Por 12 horas de trabajo, a un operario se le promete pagar $100 y un regalo. El operario se retiró&nbsp;luego de 8 horas de trabajo, por lo que recibió $60 más el regalo. ¿Cuál es el valor del regalo?</p>'
    },
    {
      correct: 4,
      options: ['<p>12 dólares</p>', '<p>15 dólares</p>', '<p>16 dólares</p>', '<p>19 dólares</p>'],
      description: '<p>Por 12 horas de trabajo, a un operario se le promete pagar $100 y un regalo. El operario se retiró&nbsp;luego de 8 horas de trabajo, por lo que recibió $60 más el regalo. ¿Cuál es el valor del regalo?</p>'
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.topicId = params.get('id');
        return of([]);
      })
    ).subscribe((data) => {

    });
  }

  getData() {

  }

}
