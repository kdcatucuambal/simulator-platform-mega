import {Component, Input, OnInit} from '@angular/core';

export interface CarouselItem{
  imgUrl: string,
  title: string,
  subtitle: string
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input('items') items: CarouselItem[] = [];
  @Input('isAlert') isAlert: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
