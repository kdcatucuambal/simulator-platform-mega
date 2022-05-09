import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestLayoutService {

  private changed = new BehaviorSubject<boolean>(false);
  private loading_ = false;

  constructor() { }

  get isChanged(){
    return this.changed.asObservable();
  }

  emitChanged(value: boolean){
    this.changed.next(value);
  }

  get loading(){
    return this.loading_;
  }

  set changed_(value: boolean){
    this.changed.next(value)
  }

  set loading(value: boolean){
    this.loading_ = value;
  }

}
