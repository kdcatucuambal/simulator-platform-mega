import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {QuestionInfo} from "../../../models/Models";

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent implements OnInit {


  @Input('question') question: QuestionInfo;
  @Output('onVote') voteEmmiter = new EventEmitter();
  likes = 0;
  dislikes = 0;

  btnClicked: number = 0;
  btnStatus = '';
  flags: boolean[] = [];

  constructor() {
  }

  ngOnInit(): void {

  }

  onClickOption(btnClicked: number) {
    if (this.btnStatus != 'btn-correct'){
      this.fillFlags(this.question.options.length);
      this.flags[btnClicked] = true;
      this.btnClicked = btnClicked;
      if (btnClicked + 1 == this.question.correct) {
        this.btnStatus = 'btn-correct';
      }else{
        this.btnStatus = 'btn-incorrect';
      }
    }
  }

  fillFlags(quantity: number) {
    for (let index = 0; index < quantity; index++) {
      this.flags[index] = false;
    }
  }

  onVote(value: boolean){
    this.voteEmmiter.emit({value, question: this.question});
  }

}
