import { state } from '../state/state.js';
import Card from './card.js';
import { menu } from '../index';
import { handleSound } from '../utils/handleSound.js';
import { nextLevelSound } from './audio.js';
import { makeFullTimeline } from './animations.js';
import { createElements } from '../utils/createElements.js';
import { nanoid } from 'nanoid';

class Game {
  parent = document.getElementById('game');
  gameContainer;
  ui;
  levelTitle;
  summary;
  playAgainBtn;
  mainMenuBtn;

  init() {
    this.#generateUI();
    this.#generateContainer();
    this.#handleCards();
    this.showUI();
    this.renderLevelTitle();
    this.showLevel();
    this.#handleStartCountdown();
  }

  #generateContainer() {
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('memory');
    this.parent.appendChild(this.gameContainer);
  }

  #handleCards() {
    this.#generateCards();
    this.#shuffleCards();
    this.#renderCards();
  }

  #setupCards() {
    console.log(state.imageCollection);
    const shuffledCollection = this.#shuffle(state.imageCollection);
    console.log(shuffledCollection);
    state.currentImageCollection = shuffledCollection;
  }

  #generateCards() {
    for (let i = 0; i < state.cardAmount / 2; i++) {
      const [img, img2] = state.currentImageCollection.at(-1);

      const card = new Card(this.gameContainer, img);
      const card2 = new Card(this.gameContainer, img2);

      state.currentImageCollection.pop();

      const id = nanoid();
      card.id = id;
      card2.id = id;

      state.allCards.push(card, card2);
    }
  }

  #shuffle(elements) {
    const toShuffle = [...elements];
    for (let i = toShuffle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [toShuffle[i], toShuffle[j]] = [toShuffle[j], toShuffle[i]];
    }
    return toShuffle;
  }

  #shuffleCards() {
    state.allCards = this.#shuffle(state.allCards);
  }

  #renderCards() {
    this.gameContainer.innerHTML = '';
    state.allCards.forEach((card, i) => {
      this.gameContainer.appendChild(card.card);
      card.card.setAttribute('pos', i);
      card.pos = i;
    });
  }

  #generateUI() {
    this.ui = document.createElement('header');
    this.ui.classList.add('ui');
    this.parent.appendChild(this.ui);

    const [statsCnt, points, time, level] = createElements('div', 'span', 'span', 'span');

    statsCnt.classList.add('stats');
    points.classList.add('stats__points');
    time.classList.add('stats__time');
    level.classList.add('stats__level');

    this.ui.appendChild(statsCnt);
    statsCnt.append(points, time, level);
  }

  showUI() {
    const pointsEl = document.querySelector('.stats__points');
    const timeEl = document.querySelector('.stats__time');
    const levelEl = document.querySelector('.stats__level');

    pointsEl.textContent = `points: ${state.points}`;
    timeEl.textContent = `time: ${state.currentTime}`;
    levelEl.textContent = `level: ${state.level}`;
  }

  renderLevelTitle() {
    const level = state.level;
    this.levelTitle = document.createElement('h2');
    this.levelTitle.classList.add('level-title');
    this.levelTitle.textContent = `Level ${level}`;
    this.parent.appendChild(this.levelTitle);
  }

  showLevel() {
    this.levelTitle.classList.add('is-visible');

    setTimeout(() => {
      this.levelTitle.classList.remove('is-visible');
      state.isGameStart = true;
    }, state.timeToStart);
  }

  renderSummary(gameStatus) {
    const markup = `
        <div class="summary">
          <div class="summary__info-container">
            <span class="summary__info">${
              gameStatus
                ? `Congratulations! <br/> You have completed the game.<br/>Gathered <span class="summary__info-color">${
                    state.points
                  }</span> ${state.points === 1 ? 'point' : 'points'}`
                : `Game over!.<br/>Gathered <span class="summary__info-color">${state.points}</span> ${
                    state.points === 1 ? 'point' : 'points'
                  }`
            }</span>
          </div>
          <div class="summary__btn-container">
            <button class="btn summary__btn summary__btn-again">Play Again</button>
            <button class="btn summary__btn summary__btn-menu">Main Menu</button>
          </div>
        </div>
    `;

    this.parent.insertAdjacentHTML('beforeend', markup);

    this.playAgainBtn = this.parent.querySelector('.summary__btn-again');
    this.mainMenuBtn = this.parent.querySelector('.summary__btn-menu');
    this.handleListeners();
  }

  handleListeners() {
    this.playAgainBtn.addEventListener('click', this.playAgain.bind(this));
    this.mainMenuBtn.addEventListener('click', () => {
      menu.init();
    });
  }

  showSummary() {
    this.renderSummary(state.isGameWon);
  }

  startGame() {
    this.#clearLevel();
    this.#setupCards();
    this.init();
  }

  startNextLevel() {
    makeFullTimeline();

    setTimeout(() => {
      this.#clearLevel();
      this.init();
    }, state.ANIMATION_TIME);
  }

  playAgain() {
    makeFullTimeline();

    setTimeout(() => {
      this.startGame();
    }, state.ANIMATION_TIME);
  }

  #clearLevel() {
    this.resetDOM();
  }

  startCountdown = () => {
    state.countdown = setInterval(() => {
      if (state.currentTime > 0 && !state.isRemovedAllCards()) {
        state.currentTime--;
        this.showUI();
      } else {
        this.checkGameStatus();
      }
    }, state.SECOND);
  };

  checkGameStatus() {
    state.isRemovedAllCards() ? this.handleLevelWin() : this.handleGameEnd();
    this.#stopGame();
  }

  #stopGame() {
    clearInterval(state.countdown);
    state.isGameOver = true;
  }

  #handleAddPoints() {
    state.points = state.currentTime * state.bonusMultiplier;
    this.showUI();
  }

  #isLastLevel() {
    return state.level === state.MAX_LEVEL;
  }

  handleLevelWin() {
    if (this.#isLastLevel()) {
      state.isGameWon = true;
      this.#handleAddPoints();
      this.handleGameEnd();
      return;
    }
    handleSound(nextLevelSound);
    this.#handleAddPoints();
    state.level++;
    state.clearLevelStats();
    this.startNextLevel();
  }

  handleGameEnd() {
    this.showSummary();
    state.clearGameStats();
  }

  resetDOM() {
    this.parent.innerHTML = '';
    this.gameContainer = null;
    this.ui = null;
    this.parent.style.backgroundImage = `url(${state.background})`;
  }

  #handleStartCountdown() {
    setTimeout(() => {
      this.startCountdown();
    }, state.timeToStart);
  }
}

export const game = new Game();
