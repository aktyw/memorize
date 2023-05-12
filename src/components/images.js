import { state } from '../state/state';
import { nanoid } from 'nanoid';

export default class Images {
  #dimensionsDesktop = '800x600';
  #dimensionsMobile = '480x320';
  #theme = 'animals';
  #url = `https://source.unsplash.com`;

  constructor() {}

  async preload() {
    const amountImagesToFetch = state.cards.reduce((a, v) => a + v);

    for (let i = 0; i < amountImagesToFetch; i++) {
      const id = nanoid();
      this.fetch(id);
    }
  }

  async fetch(id) {
    const isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
    try {
      const res = await fetch(
        `${this.#url}/${isMobile ? this.#dimensionsMobile : this.#dimensionsDesktop}/?${this.#theme}-${id}`
      );
      console.log(res);
    } catch (error) {
      throw new Error('Cannot load an image! Try again or change in-game options');
    }
  }
}
