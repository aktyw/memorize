import { opacityTime } from './helper.js';
import { game } from './index.js';

class GameState {
  points = 0;
  level = 1;
  maxLevel = 5;
  levelsOpts = {
    time: [10, 16, 24, 32, 40],
    pointsMulti: [1, 2, 3, 4, 5],
    cards: [4, 8, 12, 16, 20],
  };
  time = this.levelsOpts.time[this.level - 1];
  cardAmount = this.levelsOpts.cards[this.level - 1];
  allCards = [];
  removedCards = 0;
  openCards = [];
  isGameOver = false;
  isGameStart = false;
  timeToFlip = 1000;
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

  get isGameOver() {
    return this.isGameOver;
  }

  set addRemovedCards(amount) {
    console.log(this.removedCards);
    this.removedCards += amount;
  }

  startCountdown = () => {
    this.countdown = setInterval(() => {
      if (this.time > 0 && !this.isRemovedAll()) {
        this.time--;
        game.showUI();
      } else {
        this.checkGameStatus();
      }
    }, this.second);
  };

  isRemovedAll() {
    return this.allCards.length === this.removedCards;
  }

  checkGameStatus() {
    clearInterval(this.countdown);
    this.isGameOver = true;
    this.isRemovedAll() ? this.handleLevelWin() : this.handleGameLost();
  }

  handleLevelWin() {
    if (this.level === this.maxLevel) {
      this.handleGameWon();
      return;
    }
    this.showMessage(`You go to the Level ${this.level + 1}`);
    this.level++;
    this.points += this.time;
    this.clearStats();
    game.clearLevel();
  }

  handleGameLost() {
    this.showMessage('You Lost');
    this.saveHighScore();
    this.level = 1;
    this.points = 0;
    this.clearStats();
    game.clearLevel();
  }

  saveHighScore() {}

  clearStats() {
    this.time = this.levelsOpts.time[this.level - 1];
    this.cardAmount = this.levelsOpts.cards[this.level - 1];
    this.allCards.length = 0;
    this.removedCards = 0;
    this.openCards.length = 0;
    this.isGameOver = false;
    this.isGameStart = false;
    this.userShouldWait = false;
  }

  handleGameWon() {
    this.showMessage('You Won');
  }

  showMessage(msg) {
    console.log(msg);
  }
}

export const state = new GameState();
