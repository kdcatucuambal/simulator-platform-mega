import {Component, OnInit} from '@angular/core';
import {QuestionInfo, SimulatorInfo, User} from "../../../models/Models";
import {NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels} from "@techiediaries/ngx-qrcode";
import {SimulatorResultService} from "../../services/simulator-result.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  questions: QuestionInfo[] = [];
  simulator: SimulatorInfo = null;
  grade = 0;
  elementType = NgxQrcodeElementTypes.URL;
  url = 'https://plataforma-megapro/';
  errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = null;
  basicData = null;
  user: User = {
    id: '',
    isActive: false,
    name: '',
    created: null,
    email: '',
    lastname: '',
    identificationCard: '',
    observation: '',
    phone: '',
    role: 'admin',
  }

  constructor(
    private simulatorResultService: SimulatorResultService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.questions = this.simulatorResultService.questions;
    this.simulator = this.simulatorResultService.simulator;
    this.user = this.simulatorResultService.userInfo;
    const {totalCorrectsPerTopics, totalQuestionsPerTopics, grade} = this.simulatorResultService.getInfoFromResult();
    this.grade = grade;
    this.value = `${this.url}-${this.user.identificationCard}-${this.grade}`
    const labels = this.simulatorResultService.topics.map(item => item.name);
    this.basicData = {
      labels,
      datasets: [
        {
          label: 'Todos los aciertos',
          backgroundColor: 'rgb(192,189,189)',
          data: totalQuestionsPerTopics
        },
        {
          label: 'Aciertos obtenidos',
          backgroundColor: '#035fd1',
          data: totalCorrectsPerTopics
        }
      ]
    }
  }

  onExit(){
    this.simulatorResultService.cleanData();
    this.router.navigateByUrl('/inicio').then();
  }

}
