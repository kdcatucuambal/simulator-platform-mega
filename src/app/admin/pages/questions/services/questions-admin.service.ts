import {Injectable} from '@angular/core';
import {QueryDbService} from "../../../../services/firestore/query-db.service";
import {Area, QuestionInfo} from "../../../../models/Models";
import {from, lastValueFrom, Observable, switchMap, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuestionsAdminService {

  constructor(
    private queryDbService: QueryDbService
  ) {}

  add(collectionName: string, dataToSave: any) {
    const refPromise = this.queryDbService.dbRef.runTransaction(async transaction => {
      const topicDocRef = this.queryDbService.getDocRef('areas', collectionName);
      const topicDoc = await transaction.get(topicDocRef);
      if (!topicDoc.exists) {
        throw "Document does not exist!";
      }
      const data = topicDoc.data() as Area;
      const size = data.questions + 1;
      const responseAddDoc$ = this.queryDbService.addDoc(collectionName, {...dataToSave, index: size}).pipe(
        tap(() => {
          transaction.update(topicDocRef, {questions: size})
        })
      );
      return lastValueFrom(responseAddDoc$);
    });
    return from(refPromise);
  }

  update(collectionName: string, documentPath: string, dataToUpdate: any) {
    return this.queryDbService.updateDoc(collectionName, documentPath, dataToUpdate);
  }

  delete(collectionName: string, id: string): Observable<any> {
    const responseDeleteDoc$ = this.queryDbService.deleteDoc(collectionName, id).pipe(
      switchMap(() => {
        return this.queryDbService.getAllDocsOrderBy<QuestionInfo>(collectionName, 'index', 'asc');
      }),
      switchMap<QuestionInfo[], any>((data) => {
        const batch = this.queryDbService.executeBath();
        data.forEach((item, index) => {
          const docRef = this.queryDbService.dbRef.collection(collectionName).doc(item.id);
          batch.update(docRef, {'index': index + 1});
        });
        const topicDocRef = this.queryDbService.getDocRef('areas', collectionName);
        batch.update(topicDocRef, {'questions': data.length})
        return from(batch.commit());
      })
    );
    return from(responseDeleteDoc$);
  }
}
