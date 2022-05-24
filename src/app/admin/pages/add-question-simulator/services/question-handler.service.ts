import {Injectable} from '@angular/core';
import {QueryDbService} from "../../../../services/firestore/query-db.service";
import {Area, QuestionInfo} from "../../../../models/Models";
import {of, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuestionHandlerService {


  topics: Area[] = [];

  constructor(
    private queryDbService: QueryDbService
  ) {
    this.queryDbService.getAllDocs<Area>('areas').subscribe(data=>{
      this.topics = data;
    })
  }

  getData(
    questionIds: string[],
    questionCollectionName: string
  ) {

    return this.queryDbService
      .getAllDocs<QuestionInfo>(questionCollectionName)
      .pipe(
        switchMap(questions => {
          const targetQuestions: QuestionInfo[] = [];
          const sourceQuestions: QuestionInfo[] = [];
          questions.forEach(question => {
            const index = questionIds.findIndex(id => id == question.id);
            const topicFound = this.topics.find(topic => topic.id == question.topicId)
            question.topicName = topicFound.title;
            if (index == -1){
              //not found
              sourceQuestions.push(question);
            }else{
              //founded
              targetQuestions.push(question);
            }
          })
          return of({target: targetQuestions, source: sourceQuestions});
        })
      );
  }


}
