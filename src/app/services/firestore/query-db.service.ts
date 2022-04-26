import {Injectable} from '@angular/core';
import firebase from "firebase/compat";
import Firestore = firebase.firestore.Firestore;
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {forkJoin, from, lastValueFrom, map, Observable, of, switchMap, tap} from "rxjs";
import WhereFilterOp = firebase.firestore.WhereFilterOp;
import {Area, QuestionInfo} from "../../models/AreaModel";


@Injectable({
  providedIn: 'root'
})
export class QueryDbService {

  protected db: Firestore;

  constructor(
    private angularFirestore: AngularFirestore
  ) {
    this.db = angularFirestore.firestore;

  }

  addDoc<T>(collectionName: string, data: T) {
    const promiseRef = this.db.collection(collectionName).add(data);
    return from(promiseRef);
  }


  getAllDocs<T>(collectionName: string): Observable<T[]> {
    const promiseRef = this.db.collection(collectionName).get();
    return from(promiseRef).pipe(
      map(actions => {
        return actions.docs.map(item => {
          const data = item.data();
          const id = item.id;
          return {id, ...data} as unknown as T
        })
      })
    )
  }

  getDocById<T>(collectionName: string, id: string): Observable<T> {
    const promiseRef = this.db.collection(collectionName).doc(id).get();
    return from(promiseRef).pipe(
      switchMap(value => {
        const data = value.data();
        const id = value.id;
        return of({id, ...data} as unknown as T)
      })
    )
  }

  getDocsWhere<T>(
    collectionName: string,
    field: string,
    operator: WhereFilterOp,
    value: string): Observable<T[]> {
    const promiseRef = this.db.collection(collectionName).where(field, operator, value).get();
    return from(promiseRef).pipe(
      map(actions => {
        return actions.docs.map(item => {
          const data = item.data();
          const id = item.id;
          return {id, ...data} as unknown as T
        })
      })
    )
  }

  getPiecesOfDocs<T>(skip = 1, take = 5) {
    //TODO: Implement
  }

  getDocRef(collectionName: string, id: string){
    return this.db.collection(collectionName).doc(id);
  }

  deleteDoc(collectionName: string, documentPath: string) {
    const promiseRef = this.db.collection(collectionName).doc(documentPath).delete();
    return from(promiseRef);
  }

  updateDoc<T>(collectionName: string, documentPath: string, data: T) {
    const promiseRef = this.db.collection(collectionName).doc(documentPath).update(data);
    return from(promiseRef);
  }

  getCollections(collectionNames: string[]) {
    const observables$: Observable<any>[] = [];
    for (const collectionName of collectionNames) {
      observables$.push(this.getAllDocs<any>(collectionName))
    }
    return forkJoin(observables$)
  }



  getCollectionsWhere(
    data: {
      collectionName: string,
      where: boolean,
      whereData?: {
        field: string,
        operator: WhereFilterOp,
        value: string
      }
    }[]) {
    const observables$: Observable<any>[] = [];
    for (const item of data) {
      if (item.where) {
        const {operator, value, field} = item.whereData;
        observables$.push(this.getDocsWhere<any>(item.collectionName, field, operator, value));
      } else {
        observables$.push(this.getAllDocs<any>(item.collectionName));
      }
    }
    return forkJoin(observables$)
  }


  async saveQuestionAndUpdateSizeTransaction(collectionName: string, dataToSave: any) {

   return await this.db.runTransaction(async (transaction) => {

      const sfDocRef = this.db.collection('areas').doc(collectionName);
      const sfDoc = await transaction.get(sfDocRef);

      if (!sfDoc.exists) {
        throw "Document does not exist!";
      }

     const data = sfDoc.data() as Area;
     const size = data.questions + 1;

      const responseAddDoc$ = this.addDoc(collectionName, {...dataToSave, index: size}).pipe(
        tap(() => {
          transaction.update(sfDocRef, {questions: size})
        })
      );

      return lastValueFrom(responseAddDoc$);
    });
  }

  get dbRef(){
    return this.db;
  }




  executeBath() {
    return this.db.batch();
  }


}