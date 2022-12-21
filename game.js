import { getRandomNumber } from './helper.js';
import { state } from './state.js';
import Card from './card.js';

export default class GameStructure {
  parent = document.body;
  gameContainer;
  ui;
  startBtn;
  constructor() {
    this.init();
  }

  init() {
    this.#generateUI();
    this.#generateContainer();
    this.#makeCards(state.cardAmount);
    this.#shuffleCards(state.allCards);
    this.#renderCards();
    this.showUI();
    this.renderBtn();
    this.handleEvents();
  }

  #generateContainer() {
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('memory');
    this.parent.appendChild(this.gameContainer);
  }

  #makeCards(amount) {
    for (let i = 0; i < amount / 2; i++) {
      const card = new Card(this.gameContainer);
      const card2 = new Card(this.gameContainer);
      const id = getRandomNumber(100000, 999999);
      card.id = id;
      card2.id = id;

      const attr = card.image.getAttribute('src');
      card2.image.setAttribute('src', attr);
      state.allCards.push(card, card2);
    }
  }

  #shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
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

    const statsCnt = document.createElement('div');
    const points = document.createElement('span');
    const time = document.createElement('span');
    const level = document.createElement('span');

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
    timeEl.textContent = `time: ${state.time}`;
    levelEl.textContent = `level: ${state.level}`;
  }

  renderBtn() {
    this.renderStartBtn();
  }

  renderStartBtn() {
    this.startBtn = document.createElement('button');
    this.startBtn.classList.add('btn', 'start-btn');
    this.startBtn.textContent = 'Start';
    this.ui.appendChild(this.startBtn);
  }

  handleEvents() {
    this.startBtn.addEventListener('click', state.startCountdown, {
      once: true,
    });
  }

  resetDOM() {
    this.parent.innerHTML = '';
    this.gameContainer = null;
    this.ui = null;
    this.startBtn = null;
  }

  clearLevel() {
    this.resetDOM();
    this.init();
  }
}
