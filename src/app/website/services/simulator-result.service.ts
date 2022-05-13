import {Injectable} from '@angular/core';
import {QuestionInfo, SimulatorInfo} from "../../models/AreaModel";
import * as CryptoJS from 'crypto-js';

export interface TopicsSaved {
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class SimulatorResultService {

  private secretKey = 'simulatorservicemgp'

  constructor() {
  }

  set questions(questions: QuestionInfo[]) {
    const questionsValue = JSON.stringify(questions);
    const questionEncrypted = CryptoJS.AES.encrypt(questionsValue, this.secretKey).toString();
    localStorage.setItem('pmg-questions', questionEncrypted);
  }

  get questions() {
    const value = CryptoJS.AES.decrypt(localStorage.getItem('pmg-questions'), this.secretKey);
    return JSON.parse(value.toString(CryptoJS.enc.Utf8)) as QuestionInfo[];
  }

  set simulator(simulator: SimulatorInfo) {
    const simulatorValue = JSON.stringify(simulator);
    const simulatorValueEncrypted = CryptoJS.AES.encrypt(simulatorValue, this.secretKey).toString()
    localStorage.setItem('pmg-simulator', simulatorValueEncrypted);
  }

  get simulator() {
    const value = CryptoJS.AES.decrypt(localStorage.getItem('pmg-simulator'), this.secretKey);
    return JSON.parse(value.toString(CryptoJS.enc.Utf8)) as SimulatorInfo;
  }

  set topics(value: TopicsSaved[]) {
    localStorage.setItem('pmg-topics', JSON.stringify(value));
  }

  get topics() {
    return JSON.parse(localStorage.getItem('pmg-topics')) as TopicsSaved[];
  }

  getInfoFromResult() {
    const totalQuestionsPerTopics: number[] = [];
    const totalCorrectsPerTopics: number[] = [];
    for (const topic of this.topics) {
      const questionFilters = this.questions.filter(item => topic.name == item.topicName);
      totalQuestionsPerTopics.push(questionFilters.length);
      const correctFilters = questionFilters.filter(item => item.correct == item.selectedOption);
      totalCorrectsPerTopics.push(correctFilters.length);
    }
    const grade = totalCorrectsPerTopics.reduce((prev, curr) => prev + curr);
    return {totalQuestionsPerTopics, totalCorrectsPerTopics, grade};
  }


  cleanData() {
    localStorage.removeItem('pmg-questions');
    localStorage.removeItem('pmg-topics');
    localStorage.removeItem('pmg-simulator');
  }

}
