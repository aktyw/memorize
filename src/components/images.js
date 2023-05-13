import { state } from '../state/state';
import { nanoid } from 'nanoid';
import { loader } from './loading';

export default class Images {
  #dimensionsDesktop = '960x640';
  #dimensionsMobile = '480x320';
  #url = `https://source.unsplash.com`;
  #amountImagesToFetch;
  #loaded = 0;
  #attemptsToFetch = 0;

  async getCollection() {
    try {
      this.#attemptsToFetch++;
      if (this.#attemptsToFetch >= 5) {
        throw new Error('Too many attemps to get random card deck! Check again later or choose standard card deck');
      }

      this.#amountImagesToFetch = state.cards.reduce((a, v) => a + v) / 2;
      const fetchedCollection = [];

      for (let i = 0; i < this.#amountImagesToFetch; i++) {
        const id = nanoid();
        fetchedCollection.push(this.fetchImages(id));
      }

      const urlCollection = await Promise.allSettled(fetchedCollection);

      const fulfilledUrlCollection = urlCollection.filter(
        ({ status, value }) => status === 'fulfilled' && value.includes('photo')
      );
      const uniqueCollection = [...new Set(fulfilledUrlCollection.map((item) => item.value))];

      const imageCollection = uniqueCollection.map(this.#createPairs);

      state.imageCollection = imageCollection;

      if (state.imageCollection.length < 30) {
        this.refillImages();
      }
    } catch (error) {
      console.log(error);
      this.getFallbackCardDeck();
    }
  }

  async refillImages() {
    try {
      console.log('again');
      this.getCollection();
    } catch (error) {
      console.log(error);
    }
  }

  async fetchImages(id) {
    const isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
    try {
      const timeoutLimit = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
        }, 6000);
      });

      const fetchImage = await fetch(
        `${this.#url}/random/${isMobile ? this.#dimensionsMobile : this.#dimensionsDesktop}?${state.currentTheme}-${id}`
      );
      const res = await Promise.race([timeoutLimit, fetchImage]);

      this.#loaded++;
      loader.showPercentage(Math.floor((this.#loaded / this.#amountImagesToFetch) * 100));
      return res.url;
    } catch (error) {
      throw new Error('Cannot load an image! Try again or change in-game options', error);
    }
  }

  set attemptsToFetch(num) {
    this.#attemptsToFetch = num;
  }

  showPercentage() {}

  #createPairs(url) {
    const img = new Image();
    const img2 = new Image();
    img.src = url;
    img2.src = url;
    return [img, img2];
  }

  getFallbackCardDeck() {
    console.log('Loading local deck cards');
  }
}
