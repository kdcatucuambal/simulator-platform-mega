import {Component, Input, OnInit} from '@angular/core';
import {CarouselInfo} from "../../../models/Models";



@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input('items') items: CarouselInfo[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
