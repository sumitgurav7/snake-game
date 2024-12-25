import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  board: number[][] = [];
  snake: number[][] = [];
  food: number[] = [5, 5];
  direction: string = 'down';
  score: number = 0;
  highScore: number = 0;
  moveInterval: any;

  ngOnInit() {
    for (let i = 0; i < 20; i++) {
      this.board[i] = [];
      for (let j = 0; j < 20; j++) {
        this.board[i][j] = 0;
      }
    }
    this.attachKeyListners();
  }

  attachKeyListners() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          if (this.direction !== 'down') {
            this.direction = 'up';
          }
          break;
        case 'ArrowDown':
          if (this.direction !== 'up') {
            this.direction = 'down';
          }
          break;
        case 'ArrowLeft':
          if (this.direction !== 'right') {
            this.direction = 'left';
          }
          break;
        case 'ArrowRight':
          if (this.direction !== 'left') {
            this.direction = 'right';
          }
          break;
      }
    });
  }

  startGame() {
    this.initSnake();
  }

  initSnake() {
    this.snake.push([0, 0]);
    this.moveInterval = setInterval(() => {
      this.moveSnake();
    }, 100);
  }


  moveSnake() {
    let head = this.snake[this.snake.length - 1];
    let tail = this.snake[0];
    console.log(tail);
    let newHead: number[] = [];
    switch (this.direction) {
      case 'left':
        newHead = [head[0] - 1, head[1]];
        break;
      case 'right':
        newHead = [head[0] + 1, head[1]];
        break;
      case 'up':
        newHead = [head[0], head[1] - 1];
        break;
      case 'down':
        newHead = [head[0], head[1] + 1];
        break;
    }

    if (this.isGameOver(newHead)) {
      clearInterval(this.moveInterval);
      alert('Game Over! score: ' + this.score + ' high score: ' + this.highScore);
      this.clearGameDetails();
      return;
    } else if(this.isFood(newHead[0], newHead[1])){
      this.snake.push(newHead);
      this.generateFood();
      this.score++;
      return;
    }
    this.snake.shift();
    this.snake.push(newHead);
  }

  growSnake(){
    let head = this.snake[this.snake.length - 1];
  }

  clearGameDetails() {
    this.snake = [];
    this.food = [5, 5];
    if(this.score > this.highScore){
      this.highScore = this.score;
    }
    this.score = 0;
    this.direction = 'down';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        this.board[i][j] = 0;
      }
    }
  
  }

  generateFood() {
    let i = this.customRandom(0, 19);
    let j = this.customRandom(0, 19);
    while (this.isSnake(i, j)) {
      i = this.customRandom(0, 19);
      j = this.customRandom(0, 19);
    }
    this.food = [i, j];
  }

  customRandom(min: number, max: number) {
    const seed = Date.now() % 1000;
    const random = (seed * 9301 + 49297) % 233280 / 233280;
    return Math.floor(random * (max - min + 1)) + min;
}

  isGameOver(newHead: number[]) {
    if (
      newHead[0] < 0 ||
      newHead[0] > 19 ||
      newHead[1] < 0 ||
      newHead[1] > 19
    ) {
      return true;
    } else if(this.isSnake(newHead[0], newHead[1])) {
      return true;
    } else {
      return false;
    }
  }

  isSnake(i: number, j: number) {
    return this.snake.some((part) => part[0] === i && part[1] === j);
  }

  isFood(i: number, j: number) {
    return this.food[0] === i && this.food[1] === j;
  }
}