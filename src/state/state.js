import { opacityTime } from '../utils/helper';
import { game } from '../index.js';
import room1 from '../assets/room-1.jpg';
import room2 from '../assets/room-2.jpg';
import room3 from '../assets/room-3.jpg';
import room4 from '../assets/room-4.jpg';
import room5 from '../assets/room-5.jpg';
import room6 from '../assets/room-6.jpg';

class GameState {
  points = 0;
  level = 1;
  maxLevel = 5;
  difficulty = {
    easy: true,
    medium: false,
    hard: false,
  };
  levelOptions = {
    time: [
      [15, 25, 35, 45, 60],
      [5, 15, 25, 30, 40],
      [3, 12, 20, 25, 30],
    ],
    pointsMulti: [1, 2, 3, 4, 5],
    cards: [4, 8, 12, 16, 20],
    background: [room1, room2, room3, room4, room5, room6],
  };
  background = this.levelOptions.background[this.level - 1];
  currentTime = this.levelOptions.time[this.currentDifficultyIndex][this.level - 1];
  cardAmount = this.levelOptions.cards[this.level - 1];
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
  audio = {
    isPlayMusic: false,
    isSoundsActive: true,
  };

  changeDifficulty() {
    const difficultyKeys = Object.keys(this.difficulty);
    const currentDifficultyIndex = difficultyKeys.findIndex((key) => this.difficulty[key]);

    if (currentDifficultyIndex !== -1) {
      this.difficulty[difficultyKeys[currentDifficultyIndex]] = false;

      const nextDifficultyIndex = (currentDifficultyIndex + 1) % difficultyKeys.length;
      this.difficulty[difficultyKeys[nextDifficultyIndex]] = true;

      this.currentTime = this.levelOptions.time[this.currentDifficultyIndex][this.level - 1];
    }
  }

  get addPoints() {
    return this.points;
  }

  get currentDifficulty() {
    // eslint-disable-next-line no-unused-vars
    const [difficultyName] = Object.entries(this.difficulty).find(([_, value]) => value);
    return difficultyName;
  }

  get currentDifficultyIndex() {
    const difficultyKeys = Object.keys(this.difficulty);
    const currentDifficultyIndex = difficultyKeys.findIndex((key) => this.difficulty[key]);
    return currentDifficultyIndex;
  }

  set addPoints(amount) {
    this.points += amount * this.levelOptions.pointsMulti[this.level - 1];
  }

  get levelNum() {
    return this.level;
  }

  get audioSettings() {
    return this.audio;
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
      if (this.currentTime > 0 && !this.isRemovedAllCards()) {
        this.currentTime--;
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
      this.points += this.currentTime;
      this.isGameWon = true;
      this.handleGameEnd();
      return;
    }
    this.level++;
    this.points += this.currentTime;
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
    this.currentTime = this.levelOptions.time[this.currentDifficultyIndex][this.level - 1];
    this.cardAmount = this.levelOptions.cards[this.level - 1];
    this.background = this.levelOptions.background[this.level - 1];
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
