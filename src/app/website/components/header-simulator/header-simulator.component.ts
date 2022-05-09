import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header-simulator',
  templateUrl: './header-simulator.component.html',
  styleUrls: ['./header-simulator.component.scss']
})
export class HeaderSimulatorComponent implements OnInit {

  @Input() title = '';
  show = false;
  @Output() onEventFinish = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onSidebar(){
    this.show = !this.show;
    if (this.show){
      this.closeNav();
    }else{
      this.openNav();
    }
  }

  openNav(){
    document.getElementById("mySidebar")!.style.width = "300px";
    document.getElementById("main")!.style.marginLeft = "300px";
  }

  closeNav(){
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft= "0";
  }

  onFinish(){
    this.onEventFinish.emit('')
  }

}
