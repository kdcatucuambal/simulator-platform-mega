import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Pager} from "../paginator/paginator.helper";

interface TestQuestion {
  description: string,
  options: string[],
  correct: number
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  total = 120;
  itemsPerPage = 5;
  buttons = 5;
  pager: Pager;

  constructor() {

  }

  ngOnInit(): void {

  }


  onChangePage(pager: Pager) {
   this.pager = pager;
    console.log(this.pager)
  }


}
