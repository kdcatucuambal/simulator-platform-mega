import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-header-simulator',
  templateUrl: './header-simulator.component.html',
  styleUrls: ['./header-simulator.component.scss']
})
export class HeaderSimulatorComponent implements OnInit {

  @Input() title = '';
  @Input() showFinish = false;
  show = false;
  @Output() onEventFinish = new EventEmitter();
  @ViewChild('closeDeleteModal') btnCloseDeleteModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openDeleteModal') btnOpenDeleteModal!: ElementRef<HTMLButtonElement>;

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
    this.btnCloseDeleteModal.nativeElement.click();
  }

  onShowModalDelete(){
    this.btnOpenDeleteModal.nativeElement.click();
  }


}
