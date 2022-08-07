import { Component, HostListener } from '@angular/core';
import { BehaviorSubject, filter, interval, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _isPaused: boolean = false;
  private _score: number = 0;
  private _tickSpeed: BehaviorSubject<number> = new BehaviorSubject(1);

  set score(value: number){
    this._score = value;
    this._tickSpeed.next(value);
  }
  get score() {
    return this._score;
  }
  public tickSource!: Observable<number>;

  constructor(){
    this.tickSource = this._tickSpeed.pipe(
      switchMap(speed => interval(1000/(60 + speed * 3))),
      filter(_ => !this._isPaused)
    );
  }

  @HostListener('document:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) { 
    switch(event.key){
      case 'P':
      case 'p': {
        this._isPaused = !this._isPaused;
        break;
      }
    }
  }


}
