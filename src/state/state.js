import { opacityTime } from '../utils/helper';
import room1 from '../assets/room-1.jpg';
import room2 from '../assets/room-2.jpg';
import room3 from '../assets/room-3.jpg';
import room4 from '../assets/room-4.jpg';
import room5 from '../assets/room-5.jpg';
import room6 from '../assets/room-6.jpg';

class GameState {
  #points = 0;
  #level = 1;
  // MAX_LEVEL = 5;
  // difficulty = {
  //   easy: true,
  //   medium: false,
  //   hard: false,
  // };

  #config = {
    MAX_LEVEL: 5,
    difficulty: {
      easy: true,
      medium: false,
      hard: false,
    },
    time: [
      [15, 25, 35, 45, 60],
      [6, 15, 25, 30, 40],
      [3, 12, 20, 25, 30],
    ],
    multiplier: {
      level: [1, 1.5, 2, 2.5, 3],
      difficulty: [1, 1.5, 2],
    },
    cards: [2, 8, 12, 16, 20],
    background: [room1, room2, room3, room4, room5, room6],
    timeToFlip: 1000,
    timeToStart: 1500,
  };

  // levelOptions = {
  //   time: [
  //     [15, 25, 35, 45, 60],
  //     [6, 15, 25, 30, 40],
  //     [3, 12, 20, 25, 30],
  //   ],
  //   multiplier: {
  //     level: [1, 1.5, 2, 2.5, 3],
  //     difficulty: [1, 1.5, 2],
  //   },
  //   cards: [2, 8, 12, 16, 20],
  //   background: [room1, room2, room3, room4, room5, room6],
  // };

  background = this.#config.background[this.level - 1];
  currentTime = this.#config.time[this.currentDifficultyIndex][this.#level - 1];
  cardAmount = this.#config.cards[this.#level - 1];
  allCards = [];
  openCards = [];
  #removedCards = 0;
  #isGameOver = false;
  #isGameStart = false;
  isGameWon = false;
  // timeToFlip = 1000;
  // timeToStart = 1500;
  SECOND = 1000;
  countdown;
  timeOpacity = opacityTime / 2;
  userShouldWait = false;
  #audio = {
    isPlayMusic: false,
    isSoundsActive: true,
  };

  changeDifficulty() {
    const difficultyKeys = Object.keys(this.#config.difficulty);
    const currentDifficultyIndex = difficultyKeys.findIndex((key) => this.#config.difficulty[key]);

    if (currentDifficultyIndex !== -1) {
      this.#config.difficulty[difficultyKeys[currentDifficultyIndex]] = false;

      const nextDifficultyIndex = (currentDifficultyIndex + 1) % difficultyKeys.length;
      this.#config.difficulty[difficultyKeys[nextDifficultyIndex]] = true;

      this.currentTime = this.#config.time[this.currentDifficultyIndex][this.level - 1];
    }
  }

  get currentDifficulty() {
    // eslint-disable-next-line no-unused-vars
    const [difficultyName] = Object.entries(this.#config.difficulty).find(([_, value]) => value);
    return difficultyName;
  }

  get currentDifficultyIndex() {
    const difficultyKeys = Object.keys(this.#config.difficulty);
    const currentDifficultyIndex = difficultyKeys.findIndex((key) => this.#config.difficulty[key]);
    return currentDifficultyIndex;
  }

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points;
  }

  get bonusMultiplier() {
    const { level, difficulty } = this.#config.multiplier;
    return level[this.#level - 1] * difficulty[this.currentDifficultyIndex];
  }

  get level() {
    return this.#level;
  }

  set level(state) {
    this.#level = state;
  }

  get audio() {
    return this.#audio;
  }

  get timeToFlip() {
    return this.#config.timeToFlip;
  }

  get timeToStart() {
    return this.#config.timeToStart;
  }

  set isGameOver(state) {
    this.#isGameOver = state;
  }

  get isGameOver() {
    return this.#isGameOver;
  }

  get isGameStart() {
    return this.#isGameStart;
  }

  set isGameStart(value) {
    this.#isGameStart = value;
  }

  set removedCards(amount) {
    this.#removedCards += amount;
  }

  isRemovedAllCards() {
    return this.allCards.length === this.#removedCards;
  }

  clearGameStats() {
    this.saveHighScore();
    this.#level = 1;
    this.#points = 0;

    this.clearLevelStats();
  }

  clearLevelStats() {
    this.currentTime = this.#config.time[this.currentDifficultyIndex][this.#level - 1];
    this.cardAmount = this.#config.cards[this.#level - 1];
    this.background = this.#config.background[this.#level - 1];
    this.allCards.length = 0;
    this.#removedCards = 0;
    this.openCards.length = 0;
    this.#isGameOver = false;
    this.#isGameStart = false;
    this.isGameWon = false;
    this.userShouldWait = false;
  }

  saveHighScore() {}
}

export const state = new GameState();
