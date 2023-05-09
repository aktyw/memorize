import { state } from '../state/state.js';
import { game } from '../index.js';
import { flipCardSound, cardSuccessSound } from './audio.js';
import { handleSound } from '../utils/handleSound.js';

export default class Card {
  parent;
  card;
  cardObj;
  image;
  back;
  canResetState = false;
  constructor(selector) {
    this.parent = selector;
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

  async renderImage() {
    try {
      this.image = document.createElement('img');
      this.image.classList.add('card__image');
      const url = `https://unsplash.it/640/480?${Math.random() * 1000000}`;
      await this.image.setAttribute('src', url);

      this.image.setAttribute('draggable', `false`);
      this.card.appendChild(this.image);
    } catch (error) {
      console.log('Cannot load an image! Try again or change in-game options', error);
    }
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

  handleFlipCard() {
    this.canResetState = false;
    state.userShouldWait = false;
    this.card.classList.add('is-flipped');
    handleSound(flipCardSound);
    if (state.openCards.length > 1) {
      setTimeout(() => {
        state.openCards.forEach(({ card }) => {
          card.classList.remove('is-flipped');
        });
        this.canResetState = true;
        this.checkCards();
        state.userShouldWait = false;
      }, state.timeToFlip);
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
      !this.card.classList.contains('hidden') &&
      state.isGameStart &&
      state.currentTime !== 0
    );
  }

  isSameCard() {
    return state.openCards[0]?.pos === +this.card.getAttribute('pos');
  }

  checkCards() {
    if (!this.canCheckCards()) return;
    if (this.canRemoveCards()) {
      handleSound(cardSuccessSound);
      this.removeCards();
      return;
    }
    if (this.canResetState) {
      this.#clearState();
      return;
    }
  }

  canCheckCards() {
    const { openCards: oc } = state;
    return !(oc.length !== 2 && oc.includes(this.cardObj));
  }

  canRemoveCards() {
    if (!this.canResetState) return;
    const {
      openCards: [first, second],
    } = state;
    return first?.id === second?.id && first?.pos !== second?.pos;
  }

  removeCards() {
    setTimeout(() => {
      state.openCards.forEach(({ card }) => {
        card.classList.add('is-flipped', 'card-hidden');
        card.firstElementChild.classList.add('hidden');
      });

      this.changeStats();
      this.#clearState();
    }, 0);
  }

  changeStats() {
    state.addPoints = state.level;
    state.addRemovedCards = 2;
    game.showUI();
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
