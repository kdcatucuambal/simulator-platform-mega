import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {Pager} from "../../components/paginator/paginator.helper";
import {QuestionInfo} from "../../../models/AreaModel";
import {QueryDbService} from "../../../services/firestore/query-db.service";



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
    private queryDbService: QueryDbService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.topicId = params.get('id');
        return this.queryDbService.getPiecesOfCollection<QuestionInfo>(this.topicId);
      }),
      switchMap(data => {
        this.questions = data;
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

}
