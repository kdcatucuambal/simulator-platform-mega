import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Pager, paginate} from "./paginator.helper";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {



  @Output() changePage = new EventEmitter<any>(true);
  @Input() totalItems: number = 120; //total de items
  @Input() itemsPerPage = 5; //cantidad de elementos a mostrar por página, pageSize
  @Input() initialPage = 1; //page initial
  @Input() maxPages = 10; //quantity buttons to show

  pager: Pager = {} as Pager;

  constructor() { }

  ngOnInit() {
      this.setPage(this.initialPage);
  }

  setPage(page: number) {
    if (page != this.pager.currentPage){
      this.pager = paginate(this.totalItems, page, this.itemsPerPage, this.maxPages);
      this.changePage.emit(this.pager);
    }
  }
}


