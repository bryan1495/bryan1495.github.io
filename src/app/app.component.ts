import { Component, HostListener } from '@angular/core';
import { filter, interval, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tickSource!: Observable<number>;
  public score: number = 0;
  private _isPaused: boolean = false;

  constructor(){
    this.tickSource = interval(1000/60).pipe(filter(_ => !this._isPaused));
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
