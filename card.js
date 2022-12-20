import { gameState as state } from './state.js';

export default class Card {
  constructor(selector) {
    this.parent = selector;
    this.card = null;
    this.cardObj = null;
    this.image = null;
    this.back = null;
    this.canResetState = false;

    this.init();
  }

  init() {
    this.generateCard();
    this.handleEvents();
  }

  generateCard() {
    this.renderContainer();
    this.renderImage();
    this.renderBack();
  }

  renderContainer() {
    this.card = document.createElement('div');
    this.card.classList.add('card');
  }

  renderImage() {
    this.image = document.createElement('img');
    this.image.classList.add('card__image');
    this.image.setAttribute(
      'src',
      `https://source.unsplash.com/random/${Math.random() * 10000}`
    );
    this.image.setAttribute('draggable', `false`);
    this.image.setAttribute('draggable', `false`);
    this.card.appendChild(this.image);
  }

  renderBack() {
    this.back = document.createElement('div');
    this.back.classList.add('card-back');
    this.card.appendChild(this.back);
  }

  showCard() {
    if (!this.canShowCard()) return;
    state.userShouldWait = true;
    this.saveCardObj();
    this.addCard();
    this.handleFlipCard();
    this.checkCards();
  }

  async handleFlipCard() {
    this.card.classList.add('is-flipped');
    this.canResetState = false;
    state.userShouldWait = false;

    if (state.openCards.length > 1) {
      setTimeout(() => {
        state.openCards.forEach(({card}) => {
          card.classList.remove('is-flipped')
        })
        state.userShouldWait = false;
        this.canResetState = true;
        this.checkCards();
      }, state.time);
      return;
    }
  }

  saveCardObj() {
    const attr = this.card.getAttribute('pos');
    this.cardObj = state.allCards.find((c) => +attr === c.pos);
  }

  addCard() {
    state.openCards.push(this.cardObj);
  }

  canShowCard() {
    return (
      !state.userShouldWait &&
      state.openCards.length < 2 &&
      !this.isSameCard() &&
      !this.card.classList.contains('hidden')
    );
  }

  isSameCard() {
    return state.openCards[0]?.pos === +this.card.getAttribute('pos');
  }

  checkCards() {
    if (!this.canCheckCards()) return;
    if (this.canRemoveCards()) {
      this.removeCards();
      return;
    }
    if (this.canResetState) {
      this.#clearState();
      return;
    }
  }

  canCheckCards() {
    const { openCards: tp } = state;
    return !(tp.length !== 2 && tp.includes(this.cardObj));
  }

  canRemoveCards() {
    if (!this.canResetState) return;
    const { openCards: tp } = state;
    const [first, second] = tp;
    return first.id === second.id && first.pos !== second.pos;
  }

  removeCards() {
    setTimeout(() => {
      state.openCards.forEach(({ card }) => {
        card.classList.add('is-flipped', 'card-hidden')
        card.firstElementChild.classList.add('hidden');
      });
      state.points++;
      this.#clearState();
    }, 0);
  }

  #clearState() {
    state.openCards.length = 0;
    state.userShouldWait = false;
    this.canResetState = true;
  }

  handleEvents() {
    this.card.addEventListener('click', this.showCard.bind(this));
  }
}
