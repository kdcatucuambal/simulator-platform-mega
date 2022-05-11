import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, switchMap} from "rxjs";
import {TimerService} from "../../services/timer.service";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {Area, QuestionInfo, SimulatorInfo} from "../../../models/AreaModel";
import {AuthService} from "../../../services/firestore/auth.service";
import {SimulatorResultService} from "../../services/simulator-result.service";
import {OnExit} from "../../../guards/exit.guard";

export interface IQuestion {
  description: string,
  options: string[],
  correct: number,
  selectedOption: number,
  subject: string,
  index?: number,
  btnStatus?: 'btn-current' | 'btn-custom' | 'btn-responded'
}


@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit, OnExit {

  simulatorId = '';
  currentQuestion: QuestionInfo = null;
  options = [false, false, false, false];
  questions: QuestionInfo[] = [];
  simulator: SimulatorInfo = {
    description: '',
    instructions: '',
    id: '',
    title: '',
    minutes: 0,
    questions: null,
    imgUrl: '',
    isActive: null,
    backgroundColor: '',
    type: '',
    textColor: ''
  };
  minutes = 60;
  label = '00:00:00'
  title = 'Simuladores Megapro'
  loading = true;
  render = 0;
  areas: Area[] = [];
  questiondsId = '';
  breaks = [];
  username = '';
  textBtnNavigate = 'FINALIZAR PREGUNTA Y CONTINUAR';


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private timerService: TimerService,
    private queryDbService: QueryDbService,
    private authService: AuthService,
    private simulatorResultService: SimulatorResultService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        this.simulatorId = params.get('id');
        return this.queryDbService.getAllDocs<Area>('areas');
      }),
      switchMap(areas => {
        this.areas = areas;
        return this.queryDbService.getDocById<SimulatorInfo>('simulators', this.simulatorId);
      })
    ).subscribe((data) => {
      this.simulator = data;
      this.title = this.simulator.title;
      this.questiondsId = this.simulator.questions;
      const user = this.authService.currentUserData.name + ' ' + this.authService.currentUserData.lastname;
      this.username = user.toLocaleUpperCase();
      this.loading = false;
    });
  }

  onSelectOption(index) {
    this.fillFalseToOptions();
    this.options[index] = true;
    this.currentQuestion.selectedOption = index + 1;
  }


  onNextQuestion() {

    if (this.currentQuestion.index == this.questions.length - 1){
      this.textBtnNavigate = 'FINALIZAR SIMULADOR';
    }

    if (this.currentQuestion.index == this.questions.length){
      this.finishSimuator();
      return;
    }

    this.fillFalseToOptions();
    if (this.currentQuestion.selectedOption == -1) {
      this.currentQuestion.btnStatus = 'btn-custom';
    } else {
      this.currentQuestion.btnStatus = 'btn-responded';
    }
    this.currentQuestion = this.questions[this.currentQuestion.index];
    this.currentQuestion.btnStatus = 'btn-current';
  }

  private fillFalseToOptions() {
    this.options = this.options.map(() => false);
  }

  onInitSimulator() {
    this.loading = true;
    this.render = 1;
    this.queryDbService
      .getDocById<{ questions: QuestionInfo[] }>('simulatorsquestions', this.questiondsId)
      .subscribe(data => {
        this.questions = data.questions.map((question, index) => {
          question.selectedOption = -1;
          question.index = index + 1;
          question.topicName = this.areas.find((item) => item.id == question.subtopicId).title;
          question.btnStatus = 'btn-custom';
          return question;
        });
        this.currentQuestion = this.questions[0];
        this.currentQuestion.btnStatus = 'btn-current';
        this.getBreaks();
        this.timerService.init(this.simulator.minutes, 'minutes');
        this.initTimer();
        this.loading = false;
      })
  }

  initTimer() {

    this.timerService.onTimer().subscribe({
      next: (data) => {
        this.label = data.label;
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {

        this.router.navigateByUrl('/resultados').then();
      }
    });

  }

  finishSimuator(){
    this.simulatorResultService.questions = this.questions;
    this.simulator.time = new Date();
    this.simulatorResultService.simulator = this.simulator;
    this.timerService.finishTime();
  }

  getBreaks(){
    const topics = [];
    let account = 0;
    for (const [i, question] of this.questions.entries()) {
      if (!topics.includes(question.topicName)){
        topics.push(question.topicName);
        this.breaks.push(i + 1);
        account = 0;
      }else{
        account++;
      }
    }
    this.simulatorResultService.topics = topics;
  }

  onExit(): Observable<boolean> | Promise<boolean> | boolean {
    return confirm("¿Está seguro que quiere salir?");
  }

}

