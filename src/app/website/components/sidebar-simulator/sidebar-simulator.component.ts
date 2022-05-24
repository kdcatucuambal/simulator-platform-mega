import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {QuestionInfo} from "../../../models/Models";


@Component({
  selector: 'app-sidebar-simulator',
  templateUrl: './sidebar-simulator.component.html',
  styleUrls: ['./sidebar-simulator.component.scss']
})
export class SidebarSimulatorComponent implements OnInit {

  @Input() questions: QuestionInfo[] = [];
  @Input() timeLabel = '00:00:00';
  @Output() onChangeQuestion = new EventEmitter<any>();
  currentQuestion: QuestionInfo = null;
  @Input() breaks = [];
  @Input() username = '';

  constructor() {
  }

  ngOnInit(): void {

  }



}


