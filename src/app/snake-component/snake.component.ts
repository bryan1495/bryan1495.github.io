import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { StaticData } from '../shared/static-data';

@Component({
  selector: 'snake',
  templateUrl: './snake.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnakeComponent {
  @Input() context!: CanvasRenderingContext2D;
  @Input() 
  set tick(_: number){
    this.onTick()
  }
  @Input()
  set score(_: number){
    this.grow();
  }

  @Output() snakeCoords: EventEmitter<{x: number, y: number}> = new EventEmitter();

  private _x: number = StaticData.boardConstants.width / 2;
  private _y: number = StaticData.boardConstants.height / 2;
  private _direction: Direction = Direction.None;
  private _dirChangedAt: Array<{x: number, y: number, newDirection: Direction, visited: number}> = [];
  private _segments: Array<{x: number, y: number, direction: Direction}> = [];

  constructor(){
  }

  @HostListener('document:keydown', ['$event'])
  onKeyPress(event: KeyboardEvent) { 
    switch(event.key){
      case 'ArrowUp': {
        this._direction = Direction.Up;
        this._segments.length && this._dirChangedAt.push({x: this._x, y: this._y, newDirection: Direction.Up, visited: 0});
        break;
      }
      case 'ArrowDown': {
        this._direction = Direction.Down;
        this._segments.length && this._dirChangedAt.push({x: this._x, y: this._y, newDirection: Direction.Down, visited: 0});
        break;
      }
      case 'ArrowLeft': {
        this._direction = Direction.Left;
        this._segments.length && this._dirChangedAt.push({x: this._x, y: this._y, newDirection: Direction.Left, visited: 0});
        break;
      }
      case 'ArrowRight': {
        this._direction = Direction.Right;
        this._segments.length && this._dirChangedAt.push({x: this._x, y: this._y, newDirection: Direction.Right, visited: 0});
        break;
      }
      case ' ': {
        this.grow()
        break;
      }
    }
  }

  private grow(){
    var offset = (StaticData.snakeConstants.segmentSize * 2);
    var tailDirection = this._segments[this._segments.length - 1]?.direction ?? this._direction;
    var tailX = this._segments[this._segments.length - 1]?.x ?? this._x;
    var tailY = this._segments[this._segments.length - 1]?.y ?? this._y;
    switch(tailDirection){
      case Direction.Up:{
        this._segments.push({x: tailX, y: tailY + offset, direction: tailDirection});
        break;
      }
      case Direction.Down:{
        this._segments.push({x: tailX, y: tailY - offset, direction: tailDirection});
        break;
      }
      case Direction.Left:{
        this._segments.push({x: tailX + offset, y: tailY, direction: tailDirection});
        break;
      }
      case Direction.Right:{
        this._segments.push({x: tailX - offset, y: tailY, direction: tailDirection});
        break;
      }
    }
  }

  onTick() {
    switch(this._direction){
      case Direction.Up: {
        this._y -= StaticData.snakeConstants.velocity;
        break;
      }
      case Direction.Down: {
        this._y += StaticData.snakeConstants.velocity;
        break;
      }
      case Direction.Left: {
        this._x -= StaticData.snakeConstants.velocity;
        break;
      }
      case Direction.Right: {
        this._x += StaticData.snakeConstants.velocity;
        break;
      }
    }
    this.snakeCoords.emit({x: this._x - (StaticData.snakeConstants.segmentSize / 2), y: this._y - (StaticData.snakeConstants.segmentSize / 2)});

    this._segments.forEach((segment, index) => {
      switch(segment.direction){
        case Direction.Up: {
          segment.y -= StaticData.snakeConstants.velocity;
          break;
        }
        case Direction.Down: {
          segment.y += StaticData.snakeConstants.velocity;
          break;
        }
        case Direction.Left: {
          segment.x -= StaticData.snakeConstants.velocity;
          break;
        }
        case Direction.Right: {
          segment.x += StaticData.snakeConstants.velocity;
          break;
        }
      }

      if(this._dirChangedAt.length){
        var dirChangedAtIndexForSegment = this._dirChangedAt.filter(d => d.visited <= index)[0];
        if(dirChangedAtIndexForSegment && segment.x == dirChangedAtIndexForSegment.x && segment.y == dirChangedAtIndexForSegment.y){
          segment.direction = dirChangedAtIndexForSegment.newDirection;
          dirChangedAtIndexForSegment.visited++;

          if(this._segments.length == dirChangedAtIndexForSegment.visited){
            this._dirChangedAt.shift();
          }
        }
      }
    });

    this.render();
  }

  private render() {
    if(this.context){
      this.context.beginPath();
      this.context.arc(this._x, this._y, StaticData.snakeConstants.segmentSize, 0, 2 * Math.PI);
      this.context.stroke();
      this._segments.forEach(segment => {
        this.context.beginPath();
        this.context.arc(segment.x, segment.y, StaticData.snakeConstants.segmentSize, 0, 2 * Math.PI);
        this.context.stroke();
      });
    }
  }
}

enum Direction {
  None,
  Up,
  Down,
  Left,
  Right
}
