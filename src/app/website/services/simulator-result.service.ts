import { Injectable } from '@angular/core';
import {QuestionInfo, SimulatorInfo} from "../../models/AreaModel";

@Injectable({
  providedIn: 'root'
})
export class SimulatorResultService {

  private questions_: QuestionInfo[] = [];
  private simulatorInfo: SimulatorInfo = null;

  constructor() { }

  set questions(questions: QuestionInfo[]){
    this.questions_ = questions;
  }

  get questions(){
    return this.questions_;
  }

  set simulator(simulator: SimulatorInfo){
    this.simulatorInfo = simulator;
  }

  get simulator(){
    return this.simulatorInfo;
  }

}
