import {Injectable} from '@angular/core';
import firebase from "firebase/compat";
import Firestore = firebase.firestore.Firestore;
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {forkJoin, from, map, Observable, of, switchMap} from "rxjs";
import WhereFilterOp = firebase.firestore.WhereFilterOp;


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
      switchMap(value=>{
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
    value: string): Observable<T[]>{
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
   }[]){
   const observables$: Observable<any>[] = [];
   for (const item of data) {
     if (item.where){
       const {operator, value, field} = item.whereData;
       observables$.push(this.getDocsWhere<any>(item.collectionName, field, operator, value));
     }else{
       observables$.push(this.getAllDocs<any>(item.collectionName));
     }
   }
   return forkJoin(observables$)
 }



  async executeTransaction() {

  }

  async executeBath() {

  }



}
