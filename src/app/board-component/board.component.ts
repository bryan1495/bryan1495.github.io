import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { StaticData } from '../shared/static-data';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements AfterViewInit {
  StaticData = StaticData;
  private _tick: number = 0;
  private _food!: { x: number; y: number; };
  private _dead: boolean = false;
  @Input() 
  set tick(value: number){
    this.onTick();
    this._tick = value;
  }
  get tick(): number{
    return this._tick;
  }
  @Output() updateScore: EventEmitter<number> = new EventEmitter();

  set died(reason: string){
    if(!this._dead){
      this._dead = true;
      alert(`You died because you ${reason} \nScore: ${this.score}`);
      window.location.reload();
    }
  }
  @ViewChild('board', {static: false}) private _boardRef!: ElementRef<HTMLCanvasElement>;

  public context!: CanvasRenderingContext2D;
  public score: number = 0;

  constructor(){
    this.generateFood();
  }

  ngAfterViewInit(): void {
    this.context = this._boardRef.nativeElement.getContext('2d')!;
  }

  onTick(){
    if(this.context){
      this.context.clearRect(0, 0, StaticData.boardConstants.width, StaticData.boardConstants.height);

      this.context.fillStyle = 'green';
      this.context.fillRect(this._food.x, this._food.y, 10, 10);
    }
  }

  private generateFood(){
    this._food = {x: Math.random() * StaticData.boardConstants.width, y: Math.random() * StaticData.boardConstants.height};
  }

  updateSnakeCoords(snake: {x: number, y: number}){
    if(Math.abs(snake.x - this._food.x) <= 10 && Math.abs(snake.y - this._food.y) <= 10){ // Eaten food!
      console.log('Collision!! Snake at', snake, 'And food at', this._food)
      this.score++;
      this.updateScore.emit(this.score);

      this.generateFood();
    }

    if((snake.x >= StaticData.boardConstants.width - StaticData.snakeConstants.segmentSize
      || snake.x <= (StaticData.snakeConstants.segmentSize / 2)
      || snake.y >= StaticData.boardConstants.height - StaticData.snakeConstants.segmentSize
      || snake.y <= (StaticData.snakeConstants.segmentSize / 2))){
        this.died = 'bumped into the wall!';
    }
  }
}
