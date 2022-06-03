import {Component, Input, OnInit} from '@angular/core';

export interface Card{
  title: string,
  description: string,
  backgroundColor?: string,
  textColor?: string,
  isResource?: boolean,
  imgUrl?: string,
  isCourse: boolean,
  isActive?: boolean,
  type?: string,
  path?: string,
  id?: string
}


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input('cardInfo') cardInfo: Card = {} as Card;

  constructor() { }

  ngOnInit(): void {
  }

  onImageError(event){

  }

}
