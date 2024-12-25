import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule],
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
  touchStartX: number = 0;
  touchStartY: number = 0;
  touchEndX: number = 0;
  touchEndY: number = 0;
  speed: number = 800;
  snakeMoved: boolean = true;
  highSpeedMode: boolean = false;
  gameOverText: string = 'Game Over!';

  ngOnInit() {
    for (let i = 0; i < 20; i++) {
      this.board[i] = [];
      for (let j = 0; j < 20; j++) {
        this.board[i][j] = 0;
      }
    }
    this.speed = this.highSpeedMode ? 100 : 800;
    this.attachKeyListeners();
    this.attachTouchListeners();
  }

  attachKeyListeners() {
    document.addEventListener('keydown', this.handleKeyListeners.bind(this));
  }

  attachTouchListeners() {
    const gameBoardElement = document.getElementById('game-board');
    if (!gameBoardElement) {
      return;
    }
    gameBoardElement.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this)
    );
    gameBoardElement.addEventListener(
      'touchend',
      this.handleTouchEnd.bind(this)
    );
  }

  handleKeyListeners(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (this.direction !== 'down') {
          this.direction = 'up';
          this.snakeMoved = false;
        }
        break;
      case 'ArrowDown':
        if (this.direction !== 'up') {
          this.direction = 'down';
          this.snakeMoved = false;
        }
        break;
      case 'ArrowLeft':
        if (this.direction !== 'right') {
          this.direction = 'left';
          this.snakeMoved = false;
        }
        break;
      case 'ArrowRight':
        if (this.direction !== 'left') {
          this.direction = 'right';
          this.snakeMoved = false;
        }
        break;
    }
  }

  handleTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }

  handleTouchEnd(event: TouchEvent) {
    event.preventDefault();

    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.handleSwipeGesture();
  }

  handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && this.direction !== 'left') {
        this.direction = 'right';
        this.snakeMoved = false;
      } else if (deltaX < 0 && this.direction !== 'right') {
        this.direction = 'left';
        this.snakeMoved = false;
      }
    } else {
      if (deltaY > 0 && this.direction !== 'up') {
        this.direction = 'down';
        this.snakeMoved = false;
      } else if (deltaY < 0 && this.direction !== 'down') {
        this.direction = 'up';
        this.snakeMoved = false;
      }
    }
  }

  startGame() {
    this.initSnake();
  }

  initSnake() {
    this.snake.push([0, 0]);
    this.moveInterval = setInterval(() => {
      this.moveSnake();
    }, this.speed);
  }

  moveSnake() {
    let head = this.snake[this.snake.length - 1];
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
      alert(
        this.gameOverText +
          'score: ' +
          this.score +
          ' high score: ' +
          this.highScore
      );
      this.clearGameDetails();
      return;
    } else if (this.isFood(newHead[0], newHead[1])) {
      this.snake.push(newHead);
      this.generateFood();
      this.score++;
      this.speedUp();
      return;
    }

    this.snake.shift();
    this.snake.push(newHead);
    this.snakeMoved = true;
  }

  private speedUp() {
    if (this.speed > 50 && this.score > 0) {
      clearInterval(this.moveInterval);
      this.speed = Math.max(50, this.speed * 0.99);
      this.moveInterval = setInterval(() => {
        this.moveSnake();
      }, this.speed);
    }
  }

  growSnake() {
    let head = this.snake[this.snake.length - 1];
  }

  clearGameDetails() {
    this.snake = [];
    this.food = [5, 5];
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.speed = this.highSpeedMode ? 100 : 800;
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
    const random = ((seed * 9301 + 49297) % 233280) / 233280;
    return Math.floor(random * (max - min + 1)) + min;
  }

  isGameOver(newHead: number[]) {
    if (
      newHead[0] < 0 ||
      newHead[0] > 19 ||
      newHead[1] < 0 ||
      newHead[1] > 19
    ) {
      this.gameOverText = 'Game Over! Out of bounds';
      return true;
    } else if (this.isSnake(newHead[0], newHead[1])) {
      this.gameOverText = 'Game Over! Snake bit itself';
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

  changeDirection(direction: string) {
    switch (direction) {
      case 'up':
        if (this.direction !== 'down') {
          this.direction = 'up';
        }
        break;
      case 'down':
        if (this.direction !== 'up') {
          this.direction = 'down';
        }
        break;
      case 'left':
        if (this.direction !== 'right') {
          this.direction = 'left';
        }
        break;
      case 'right':
        if (this.direction !== 'left') {
          this.direction = 'right';
        }
        break;
    }
  }

  ngOnDestroy() {
    clearInterval(this.moveInterval);
    document.removeEventListener('keydown', this.handleKeyListeners.bind(this));
    document.removeEventListener(
      'touchstart',
      this.handleTouchStart.bind(this)
    );
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  highSpeedModeChange($event: any) {
    this.highSpeedMode = $event;
    this.speed = this.highSpeedMode ? 100 : 800;
  }
}
