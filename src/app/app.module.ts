import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './board-component/board.component';
import { SnakeComponent } from './snake-component/snake.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SnakeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
