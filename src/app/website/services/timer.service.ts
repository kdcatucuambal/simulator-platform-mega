import {Injectable} from '@angular/core';
import {map, takeWhile, tap, timer} from "rxjs";

interface Time{
  hours: number,
  minutes: number,
  seconds: number,
  label: string
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {


  private timeInSeconds = 0;

  private conversionValues = {
    hours: 3600,
    minutes: 60,
    seconds: 1
  }

  private time: Time = {
    hours: 0,
    label: '',
    minutes: 0,
    seconds: 0
  }


  constructor() {

  }

  init(time: number, type: 'hours' | 'minutes' | 'seconds') {
    this.timeInSeconds = time * this.conversionValues[type];
  }

  onTimer() {
    return timer(1000, 1000).pipe(
      takeWhile(() => this.timeIsUp()),
      tap(() => this.subtractTime()),
      map(() => {
        return this.time;
      }),
    );
  }


  private timeIsUp() {
    return this.timeInSeconds >= 0;
  }

  finishTime(){
    this.timeInSeconds = -1;
  }

  private subtractTime() {
    const days = Math.floor(this.timeInSeconds / 24 / 60 / 60);
    const hoursLeft = Math.floor((this.timeInSeconds) - (days * 86400));
    const hours = Math.floor(hoursLeft / 3600);
    const minutesLeft = Math.floor((hoursLeft) - (hours * 3600));
    const minutes = Math.floor(minutesLeft / 60);
    const remainingSeconds = this.timeInSeconds % 60;
    this.time.seconds = remainingSeconds;
    this.time.minutes = minutes;
    this.time.hours = hours;
    this.time.label = `${hours < 10 ? '0' + hours : hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`
    this.timeInSeconds--;
  }

}


