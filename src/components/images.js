import { state } from '../state/state';
import { nanoid } from 'nanoid';
import { loader } from './loading';

export default class Images {
  #dimensionsDesktop = '960x640';
  #dimensionsMobile = '480x320';
  #theme = state.theme || 'random';
  #url = `https://source.unsplash.com`;
  #amountImagesToFetch;
  #loaded = 0;

  async getCollection() {
    try {
      this.#amountImagesToFetch = state.cards.reduce((a, v) => a + v) / 2;
      const fetchedCollection = [];

      for (let i = 0; i < this.#amountImagesToFetch; i++) {
        const id = nanoid();
        fetchedCollection.push(this.fetchImages(id));
      }

      const urlCollection = await Promise.all(fetchedCollection);
      const imageCollection = urlCollection.map(this.#createPairs);

      state.urlCollection = urlCollection;
      state.imageCollection = imageCollection;
    } catch (error) {
      console.log(error);
      state.collection = this.getFallback();
    }
  }

  async fetchImages(id) {
    const isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
    try {
      const res = await fetch(
        `${this.#url}/${isMobile ? this.#dimensionsMobile : this.#dimensionsDesktop}/?${this.#theme}-${id}`
      );
      this.#loaded++;
      loader.showPercentage(Math.floor((this.#loaded / this.#amountImagesToFetch) * 100));
      return res.url;
    } catch (error) {
      throw new Error('Cannot load an image! Try again or change in-game options', error);
    }
  }

  showPercentage() {}

  #createPairs(url) {
    const img = new Image();
    const img2 = new Image();
    img.src = url;
    img2.src = url;
    return [img, img2];
  }

  getFallback() {
    // return locals
  }
}
