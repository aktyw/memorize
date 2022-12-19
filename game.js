import { CARD_NUMBER } from './config.js';
import Card from './card.js';
import { getRandomNumber } from './helper.js';
import { gameState as state } from './state.js';

class Game {
  constructor() {
    this.gameContainer = null;
    this.parent = document.body;

    this.points = null;
    this.lives = null;

    this.init();
  }

  init() {
    this.#generateContainer();
    this.#getCards();
    this.#shuffleCards(state.allCards);
    this.#renderCards();
    this.#generateStatsEl();
    this.showStats();
  }

  #generateContainer() {
    this.gameContainer = document.createElement('div');
    this.gameContainer.classList.add('memory');
    this.parent.appendChild(this.gameContainer);
  }

  #generateStatsEl() {
    const statsCnt = document.createElement('div');
    const points = document.createElement('span');
    const lives = document.createElement('span');

    statsCnt.classList.add('stats');
    points.classList.add('stats__points');
    lives.classList.add('stats__lives');

    this.parent.appendChild(statsCnt);
    statsCnt.append(points, lives);
  }

  #getCards() {
    for (let i = 0; i < CARD_NUMBER / 2; i++) {
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

  showStats() {
    const { points, lives } = state;
    this.points = points;
    this.lives = lives;
    const pointsEl = document.querySelector('.stats__points');
    const livesEl = document.querySelector('.stats__lives');
    pointsEl.textContent = `Points: ${this.points}`;
    livesEl.textContent = `Lives: ${this.lives}`;
  }
}

const game = new Game();
