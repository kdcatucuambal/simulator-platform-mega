import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {QueryDbService} from "./query-db.service";
import {InfoBySimulator, InfoByTopic, User} from "../../models/Models";
import {BehaviorSubject, catchError, finalize, from, map, Observable, skip, switchMap, throwError} from "rxjs";
import {TopicsSaved} from "../../website/services/simulator-result.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserData_: User = null;
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private fireAuth: AngularFireAuth,
    private queryDbService: QueryDbService
  ) {
    this.authStatusListener();
  }

  login(email: string, password: string) {
    return this.queryDbService
      .getDocsWhere<User>('users', 'email', '==', email)
      .pipe(switchMap(users => {
          if (users.length == 1 && users[0].isActive) {
            this.currentUserData_ = users[0];
            return from(this.fireAuth.signInWithEmailAndPassword(email, password));
          } else {
            return from(null);
          }
        }),
        map(user => {
          if (!user) {
            this.loggedIn.next(true);
          }
          return user;
        }),
        catchError((err) => this.handlerError(err))
      );
  }

  logout() {
    return from(this.fireAuth.signOut()).pipe(
    );
  }

  get currentUserData() {
    return this.currentUserData_;
  }

  get userInitialLetters(){
    const {name, lastname} = this.currentUserData_;
    return name[0].toLocaleUpperCase() + lastname[0].toLocaleUpperCase();
  }

  get userLabelName(){
    const {name, lastname} = this.currentUserData_;
    return `${name.toUpperCase()} ${lastname.toUpperCase()}`
  }

  get isLogged() {
    return this.loggedIn.asObservable().pipe(skip(1));
  }

  getCurrentUser() {
    return from(this.fireAuth.currentUser);
  }

  resetPassword(email: string) {
    return from(this.fireAuth.sendPasswordResetEmail(email));
  }

  authStatusListener() {
    //this.fireAuth.setPersistence('session').then
    this.fireAuth.onAuthStateChanged((user) => {
      if (user) {
        this.queryDbService
          .getDocsWhere<User>('users', 'email', '==', user.email)
          .subscribe(data => {
            if (data.length == 1 && data[0].isActive) {
              this.currentUserData_ = data[0];
              this.loggedIn.next(true);
            } else {
              this.fireAuth.signOut();
            }
          })
      } else {
        this.loggedIn.next(false);
      }
    })
  }

  register(user: User) {
    const createdObsRef = from(this.fireAuth.createUserWithEmailAndPassword(user.email, user.password));
    return createdObsRef.pipe(
      switchMap(created => {
        return from(created.user.updateProfile({displayName: user.name + ' ' + user.lastname}));
      }),
      switchMap(() => {
        return this.logout();
      }),
      switchMap(() => this.queryDbService.addDoc<User>('users', user))
    )
  }

  private handlerError(err: any): Observable<never> {
    let errorMessage = 'An error ocurred ' + err
    return throwError(() => errorMessage)
  }

  saveResults(
    totalCorrectsPerTopic: number[],
    totalQuestionsPerTopic: number[],
    grade: number,
    simulatorId: string,
    topicsTaken: TopicsSaved[]
  ) {
    console.log(totalCorrectsPerTopic)
    console.log(totalQuestionsPerTopic)
    console.log(grade)
    console.log(simulatorId)
    console.log(topicsTaken)
    //grade son los aciertos
    const {statisticsByTopic, statisticsBySimulator, id} = this.currentUserData;
    const simulatorDone = statisticsBySimulator.find(item => item.simulatorId == simulatorId);
    const total = totalQuestionsPerTopic.reduce((prev, next) => (prev + next));
    const hits = totalCorrectsPerTopic.reduce((prev, next) => (prev + next));
    // Calculate to simulator
    if (simulatorDone) {
      //TODO: Check grade

      simulatorDone.average = ((simulatorDone.average) + (grade * 10 / total)) / 2;
      simulatorDone.attemps++;
      simulatorDone.hits = totalCorrectsPerTopic.reduce((prev, next) => (prev + next)); //aciertos
      simulatorDone.total = totalQuestionsPerTopic.reduce((prev, next) => (prev + next));
    } else {
      const statisticsFromSimulator: InfoBySimulator = {
        total,
        hits,
        average: (grade * 10) / total,
        attemps: 1,
        simulatorId: simulatorId
      }
      statisticsBySimulator.push(statisticsFromSimulator);
    }

    // Calculate per topic
    for (const [index, topic] of topicsTaken.entries()) {
      const topicCurrent = statisticsByTopic.find(item => item.topicId == topic.id);
      const hits = totalCorrectsPerTopic[index];
      const totalPerTopic = totalQuestionsPerTopic[index];
      const newPercentage = (hits * 100) / totalPerTopic;
      if (topicCurrent) {
        topicCurrent.hitPercentage = (topicCurrent.hitPercentage + newPercentage) / 2;
      } else {
        const statisticsFromTopic: InfoByTopic = {
          topicId: topic.id,
          hitPercentage: newPercentage
        }
        statisticsByTopic.push(statisticsFromTopic);
      }
    }
    return this.queryDbService.updateDoc('users', id, this.currentUserData);
  }

}
