import { opacityTime } from '../utils/helper';
import room1 from '../assets/room-1.webp';
import room2 from '../assets/room-2.webp';
import room3 from '../assets/room-3.webp';
import room5 from '../assets/room-5.webp';
import room6 from '../assets/room-6.webp';

class GameState {
  #points = 0;
  #level = 1;

  #config = {
    MAX_LEVEL: 5,
    difficulty: {
      easy: true,
      medium: false,
      hard: false,
    },

    time: [
      [12, 25, 35, 45, 60],
      [6, 15, 25, 30, 40],
      [3, 12, 20, 25, 30],
    ],

    multiplier: {
      level: [1, 1.25, 1.5, 1.75, 2],
      difficulty: [1, 1.5, 2],
    },

    // cards: [2, 2, 2, 2, 2],
    // cards: [4, 8],
    cards: [4, 8, 12, 16, 20],
    currentTheme: 'random',
    themes: ['city', 'nature', 'cyberpunk', 'cars', 'wildlife', 'food', 'cosmos'],
    background: [room1, room2, room3, room5, room6],

    timeToFlip: 1000,
    timeToStart: 1200,
  };

  #audio = {
    isPlayMusic: false,
    isSoundsActive: true,
  };

  #urlCollection = [];
  #imageCollection = [];
  #currentImageCollection = [];

  background = this.#config.background[this.level - 1];
  currentTime = this.#config.time[this.currentDifficultyIndex][this.#level - 1];
  cardAmount = this.#config.cards[this.#level - 1];

  allCards = [];
  openCards = [];
  #removedCards = 0;
  userShouldWait = false;

  #isGameOver = false;
  #isGameStart = false;
  #isGameWon = false;

  countdown;
  timeOpacity = opacityTime / 2;
  SECOND = 1000;
  START_ANIMATION_TIME = 1000;
  ANIMATION_TIME = this.START_ANIMATION_TIME / 2;

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
    this.#points += Math.floor(points);
  }

  get bonusMultiplier() {
    const { level, difficulty } = this.#config.multiplier;
    return level[this.#level - 1] * difficulty[this.currentDifficultyIndex];
  }

  get level() {
    return this.#level;
  }

  get cards() {
    return this.#config.cards;
  }

  get MAX_LEVEL() {
    return this.#config.MAX_LEVEL;
  }

  set level(state) {
    this.#level = state;
  }

  get currentImageCollection() {
    return this.#currentImageCollection;
  }

  get imageCollection() {
    return this.#imageCollection;
  }

  get urlCollection() {
    return this.#urlCollection;
  }

  set currentImageCollection(img) {
    this.#currentImageCollection = img;
  }

  set imageCollection(img) {
    this.#imageCollection = img;
  }

  set urlCollection(url) {
    this.#urlCollection = url;
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

  get isGameWon() {
    return this.#isGameWon;
  }

  set isGameWon(value) {
    this.#isGameWon = value;
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
