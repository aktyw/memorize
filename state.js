import { opacityTime } from './helper.js';
import { game } from './index.js';

class GameState {
  points = 0;
  level = 1;
  maxLevel = 5;
  levelsOpts = {
    // time: [6, 15, 25, 30, 40],
    time: [16, 25, 35, 45, 60],
    pointsMulti: [1, 2, 3, 4, 5],
    cards: [4, 8, 12, 16, 20],
    background: [
      './assets/room-4.jpg',
      './assets/room-3.jpg',
      './assets/room-2.jpg',
      './assets/room-5.jpg',
      './assets/room-6.jpg',
    ],
  };
  background = this.levelsOpts.background[this.level - 1];
  time = this.levelsOpts.time[this.level - 1];
  cardAmount = this.levelsOpts.cards[this.level - 1];
  allCards = [];
  removedCards = 0;
  openCards = [];
  isGameOver = false;
  isGameStart = false;
  isGameWon = false;
  timeToFlip = 1000;
  timeToStart = 1500;
  second = 1000;
  countdown;
  timeOpacity = opacityTime / 2;
  userShouldWait = false;

  get addPoints() {
    return this.points;
  }

  set addPoints(amount) {
    this.points += amount * this.levelsOpts.pointsMulti[this.level - 1];
  }

  get levelNum() {
    return this.level;
  }

  get isGameOver() {
    return this.isGameOver;
  }

  get isGameStart() {
    return this.isGameStart;
  }

  set isGameStart(value) {
    console.log();
    this.isGameStart = value;
  }

  set addRemovedCards(amount) {
    this.removedCards += amount;
  }

  startCountdown = () => {
    this.countdown = setInterval(() => {
      if (this.time > 0 && !this.isRemovedAllCards()) {
        this.time--;
        game.showUI();
      } else {
        this.checkGameStatus();
      }
    }, this.second);
  };

  isRemovedAllCards() {
    return this.allCards.length === this.removedCards;
  }

  checkGameStatus() {
    clearInterval(this.countdown);
    this.isGameOver = true;
    this.isRemovedAllCards() ? this.handleLevelWin() : this.handleGameEnd();
  }

  handleLevelWin() {
    if (this.level === this.maxLevel) {
      this.points += this.time;
      this.isGameWon = true;
      this.handleGameEnd();
      return;
    }
    this.level++;
    this.points += this.time;
    this.clearLevelStats();
    game.startGame();
  }

  handleGameEnd() {
    game.showSummary();
    this.clearGameStats();
  }

  clearGameStats() {
    this.saveHighScore();
    this.level = 1;
    this.points = 0;

    this.clearLevelStats();
  }

  clearLevelStats() {
    this.time = this.levelsOpts.time[this.level - 1];
    this.cardAmount = this.levelsOpts.cards[this.level - 1];
    this.background = this.levelsOpts.background[this.level - 1];
    this.allCards.length = 0;
    this.removedCards = 0;
    this.openCards.length = 0;
    this.isGameOver = false;
    this.isGameStart = false;
    this.isGameWon = false;
    this.userShouldWait = false;
  }

  saveHighScore() {}

  showMessage(msg) {
    console.log(msg);
  }
}

export const state = new GameState();
