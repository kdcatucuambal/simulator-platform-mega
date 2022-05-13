import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {QueryDbService} from "./query-db.service";
import {User} from "../../models/AreaModel";
import {BehaviorSubject, catchError, finalize, from, map, Observable, skip, switchMap, throwError} from "rxjs";
import {SimulatorResultService} from "../../website/services/simulator-result.service";


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
      finalize(() => this.loggedIn.next(false))
    );
  }

  get currentUserData() {
    return this.currentUserData_;
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
      console.log(user)
      if (user) {
        this.queryDbService
          .getDocsWhere<User>('users', 'email', '==', user.email)
          .subscribe(data => {
            if (data.length == 1 && data[0].isActive) {
              this.currentUserData_ = data[0];
              this.loggedIn.next(true);
            } else {
              this.logout();
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
      switchMap(() => this.queryDbService.addDoc<User>('users', user))
    )
  }

  private handlerError(err: any): Observable<never> {
    let errorMessage = 'An error ocurred ' + err
    return throwError(() => errorMessage)
  }

  saveResults(){
    const {statisticsBySimulator, statisticsByTopic, id} = this.currentUserData;
   // this.simulatorResultService.topics;
    this.queryDbService.updateDoc('users', id, this.currentUserData);
  }

}
