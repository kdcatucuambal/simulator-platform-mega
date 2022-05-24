import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {Pager} from "../../components/paginator/paginator.helper";
import {QuestionInfo} from "../../../models/Models";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {AuthService} from "../../../services/firestore/auth.service";



@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {

   topicId = '';
   totalItems;
   topicTitle = '';
   skip = 1;
   take = 5;
   loading = true;

  currentPage = 1;

  questions: QuestionInfo[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private queryDbService: QueryDbService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.topicId = params.get('id');
        return this.queryDbService.getPiecesOfCollection<QuestionInfo>(this.topicId);
      }),
      switchMap(data => {
        this.questions = data as QuestionInfo[];
        return this.queryDbService.getDocById('areas', this.topicId);
      })
    ).subscribe((currentTopic: any) => {

      this.topicTitle = currentTopic.title;
      this.totalItems = currentTopic['questions'];
      this.loading = false;
    });
  }



  onChangePage(pager: Pager){
    this.loading = true;
    this.skip =  pager.currentPage * 5 - 4;
    this.queryDbService.getPiecesOfCollection<QuestionInfo>(this.topicId, this.skip).subscribe(data => {
      this.questions = data;
      this.loading = false;
      this.currentPage = pager.currentPage;
    });
  }

  onSaveVote(data: {value: boolean, question: QuestionInfo}){
    console.log("practice: ", data.value)
    const currentAuthId = this.authService.currentUserData.id;

    const exist = data.question.votes.find((element) => {
     const [id] = element.split(':');
     if (currentAuthId == id){
       return element;
     }
     return null;
    });

    let vote = '';

    if (exist){
      data.question.votes = data.question.votes.map(item => {
        const [id] = item.split(':');
        if (id == currentAuthId){
          return `${currentAuthId}:${data.value}`;
        }
        return item;
      })
      //update
    }else{
      //add and save
      vote = `${currentAuthId}:${data.value}`;
       data.question.votes = [...data.question.votes, vote];
    }

    this.queryDbService
      .updateDoc(this.topicId, data.question.id, {votes: data.question.votes}).subscribe();
  }

}
