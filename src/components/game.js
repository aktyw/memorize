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
  submitScore;
  submitInput;
  playAgainBtn;
  mainMenuBtn;
  #summaryScore;
  #points;
  #isHighScore = false;

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
    const shuffledCollection = this.#shuffle(state.imageCollection);
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
    points.classList.add('stats-points');
    time.classList.add('stats-time');
    level.classList.add('stats-level');

    this.ui.appendChild(statsCnt);
    statsCnt.append(points, time, level);
  }

  showUI() {
    const pointsEl = document.querySelector('.stats-points');
    const timeEl = document.querySelector('.stats-time');
    const levelEl = document.querySelector('.stats-level');

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

  getHighScoreTemplate() {
    return `<div class="summary-score">
    <span class="summary-score-title"> You're on the high scores!</span>
    <form class="summary-form">
    <input placeholder="Enter name" class="summary-form-input" type="text" id="name" name="name" minlength="3" maxlength="14">
    <button class="btn summary-form-submit summary-btn" type="submit">Submit</button>
    </form>
  </div>`;
  }

  getSummaryTemplate() {
    const summary = `
    <div class="summary">
      <div class="summary-info-container">
        <span class="summary-info">${
          state.isGameWon
            ? `Congratulations! <br/> You completed the game.<br/>Gathered <span class="summary-info-color">${
                this.#points
              }</span> ${this.#points === 1 ? 'point' : 'points'}`
            : `Time's up! You lost the game<br/>Gathered <span class="summary-info-color">${this.#points}</span> ${
                this.#points === 1 ? 'point' : 'points'
              }`
        }</span>
      </div>
      ${this.#isHighScore ? this.getHighScoreTemplate() : ''}
      <div class="summary-btn-container">
        <button class="btn summary-btn summary-btn-again">Play Again</button>
        <button class="btn summary-btn summary-btn-menu">Main Menu</button>
      </div>
    </div>
    `;

    return summary;
  }

  #showSubmitInfo() {
    this.#summaryScore.innerHTML = '';

    const template = `<span class="summary-info">Score saved succesfully</span>`;

    this.#summaryScore.insertAdjacentHTML('afterbegin', template);
  }

  #showSubmitErrorInfo() {
    this.#summaryScore.innerHTML = '';

    const template = `<span class="summary-info">Something get wrong.</br> We could not save your score.</span>`;

    this.#summaryScore.insertAdjacentHTML('afterbegin', template);
  }

  #appendSummaryTemplate() {
    this.parent.insertAdjacentHTML('beforeend', this.getSummaryTemplate());
    this.#summaryScore = document.querySelector('.summary-score');
  }

  #checkIfIsHighScore() {
    const isGreaterThanLastScore = this.#points > (state.highScores?.at(-1)?.score ?? 0);
    const isRoomForScore = state.highScores?.length < 10;
    this.#isHighScore = (isGreaterThanLastScore || isRoomForScore) && this.#points > 0;
  }

  #saveTempPoints() {
    this.#points = state.points;
  }

  #handleHighScoresForm() {
    if (!this.#isHighScore) return;

    this.submitScore = this.parent.querySelector('.summary-form-submit');
    this.submitInput = this.parent.querySelector('.summary-form-input');

    this.submitScore.addEventListener('click', this.handleSubmitScore.bind(this));
  }

  #handleNextSummaryAction() {
    this.playAgainBtn = this.parent.querySelector('.summary-btn-again');
    this.mainMenuBtn = this.parent.querySelector('.summary-btn-menu');

    this.playAgainBtn.addEventListener('click', this.playAgain.bind(this));
    this.mainMenuBtn.addEventListener('click', () => menu.init());
  }

  renderSummary() {
    this.#updateScoresFromStorage();
    this.#saveTempPoints();
    this.#checkIfIsHighScore();
    this.#appendSummaryTemplate();
    this.#handleHighScoresForm();
    this.#handleNextSummaryAction();
  }

  handleSubmitScore(e) {
    try {
      e.preventDefault();

      const value = this.submitInput.value.trim();

      const highScore = {
        name: value,
        score: this.#points,
      };

      this.#sendScores(highScore);
      this.#saveScoreToStorage();
      this.#showSubmitInfo();
    } catch (error) {
      this.#showSubmitErrorInfo();
      console.log(error);
    }
  }

  #sendScores(score) {
    state.highScores = [...state.highScores, score].sort((a, b) => b.score - a.score).slice(0, state.MAX_HIGHSCORE);
  }

  #updateScoresFromStorage() {
    const highScores = window.localStorage.getItem('highScores');
    if (!highScores) return;
    state.highScores = JSON.parse(window.localStorage.getItem('highScores'));
  }

  #saveScoreToStorage() {
    try {
      window.localStorage.setItem('highScores', JSON.stringify(state.highScores));
    } catch (error) {
      throw new Error('Could not save to local storage');
    }
  }

  showSummary() {
    this.renderSummary();
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
