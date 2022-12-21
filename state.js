import { opacityTime } from './helper.js';
import { game } from './index.js';
import Card from './card.js';

class GameState {
  points = 0;
  level = 1;
  maxLevel = 3;
  levelsOpts = {
    time: [10, 16, 24, 32, 40],
    pointsMulti: [1, 1.1, 1.25, 1.5, 2],
    cards: [4, 8, 12, 16, 20],
  };
  time = this.levelsOpts.time[this.level - 1];
  cardAmount = this.levelsOpts.cards[this.level - 1];

  allCards = [];
  removedCards = 0;
  openCards = [];
  isGameOver = false;

  timeToFlip = 1000;
  second = 1000;
  countdown = null;
  timeOpacity = opacityTime / 2;
  userShouldWait = false;

  get addPoints() {
    return this.points;
  }

  set addPoints(amount) {
    this.points += amount * this.levelsOpts.pointsMulti[this.level - 1];
  }

  get levelInfo() {
    return this.level;
  }

  get isGameOver() {
    return this.isGameOver;
  }

  set addRemovedCards(amount) {
    console.log(this.removedCards);
    this.removedCards += amount;
  }

  timer = () => {
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

  checkGameStatus = () => {
    clearInterval(this.countdown);
    this.isGameOver = true;
    this.isRemovedAll() ? this.handleLevelWin() : this.handleGameLost();
  };

  handleLevelWin() {
    if (this.level === this.maxLevel) {
      this.handleGameWon();
      return;
    }
    this.level++;
    this.points += this.time;
    this.time = this.levelsOpts.time[this.level - 1];

    game.clearLevel();
  }

  handleGameLost() {
    this.showMessage('You Lost');
    this.level = 1;
    this.time = this.levelsOpts.pointsMulti[this.level - 1];
    this.allCards.length = 0;
    this.removedCards = 0;
    this.openCards.length = 0;
    this.isGameOver = false;
    this.userShouldWait = false;

    game.clearLevel();
    console.log(card);
    Card.clearCards();
  }

  handleGameWon() {
    this.showMessage('You Won');
  }

  showMessage(msg) {
    //temporary console.log
    console.log(msg);
  }
}

export const state = new GameState();
