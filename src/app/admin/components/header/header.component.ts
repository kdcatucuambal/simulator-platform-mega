import {Component, OnInit, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-header-admin',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output('onSidebar') eventEmitterSidebar = new EventEmitter<boolean>();
  show = true;

  constructor() { }

  ngOnInit(): void {

  }

  onSideBar(){
    this.show = !this.show
    this.eventEmitterSidebar.emit(this.show);
  }


}
