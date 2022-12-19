import { gameState as state } from './state.js';

export default class Card {
  constructor(selector) {
    this.parent = selector;
    this.card = null;
    this.cardToFind = null;
    this.image = null;
    this.back = null;

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
    this.saveCardToFind();
    this.handleFlipCard();
    this.addCard();
    this.checkCards();
  }

  handleFlipCard() {
    this.card.classList.toggle('is-flipped');
    setTimeout(() => {
      this.card.classList.toggle('is-flipped');
      state.userShouldWait = false;
    }, state.time);
  }

  saveCardToFind() {
    const attr = this.card.getAttribute('pos');
    this.cardToFind = state.allCards.find((c) => +attr === c.pos);
  }

  canShowCard() {
    return !(
      this.someCardIsFlipped() ||
      state.userShouldWait ||
      state.targetPairs.includes(this.cardToFind)
    );
  }

  someCardIsFlipped() {
    return [...this.parent.children].some((cardEl) =>
      cardEl.classList.contains('is-flipped')
    );
  }

  addCard() {
    state.targetPairs.push(this.cardToFind);
  }

  checkCards() {
    if (!this.canCheckCards()) return;
    if (this.canRemoveCards()) {
      this.removeCards();
      return;
    }
    this.#clearTargets();
  }

  canCheckCards() {
    const { targetPairs: tp } = state;
    return !(tp.length < 2 && tp.includes(this.cardToFind));
  }

  canRemoveCards() {
    const { targetPairs: tp } = state;
    const [first, second] = tp;
    return first.id === second.id && first.pos !== second.pos;
  }

  removeCards() {
    setTimeout(() => {
      state.targetPairs.forEach(({ card }) => {
        card.classList.add('hidden');
      });
      state.points++;
      this.#clearTargets();
    }, state.time);
  }

  #clearTargets() {
    state.targetPairs.length = 0;
    state.userShouldWait = false;
  }

  handleEvents() {
    this.card.addEventListener('click', this.showCard.bind(this));
  }
}
