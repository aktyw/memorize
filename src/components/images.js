import { state } from '../state/state';
import { nanoid } from 'nanoid';
import { loader } from './loading';

export default class Images {
  #dimensionsDesktop = '960x640';
  #dimensionsMobile = '480x320';
  #url = `https://source.unsplash.com`;
  #amountImagesToFetch;
  #timesLoaded = 0;
  #attemptsToFetch = 0;
  #currentCollectionLength = 0;
  #collection = [];
  #TIME_FETCH_LIMIT = 8000;
  #ATTEMPS_FETCH_LIMIT = 10;

  async getCollection() {
    try {
      this.#attemptsToFetch++;

      if (this.#attemptsToFetch >= this.#ATTEMPS_FETCH_LIMIT) {
        throw new Error('Too many attemps to get images!');
      }

      this.#amountImagesToFetch = state.cards?.reduce((a, v) => a + v) / 2 - this.#currentCollectionLength;

      const fetchedCollection = [];
      for (let i = 0; i < this.#amountImagesToFetch; i++) {
        const id = nanoid();
        fetchedCollection.push(this.fetchImages(id));
      }
      const collection = await Promise.allSettled(fetchedCollection).then((results) =>
        results.map((result) => result.value)
      );

      const imageCollection = this.removeDuplicates(collection).map(this.#createPairs);

      this.#collection = [...imageCollection, ...this.#collection];

      state.imageCollection = this.#collection;

      this.#currentCollectionLength = this.#collection.length;

      if (state.imageCollection.length < state.AMOUNT_IMAGES_REQUIRED) {
        this.refillImages();
      }
    } catch (error) {
      throw new Error('Could not get a collection', error);
    }
  }

  async refillImages() {
    try {
      await this.getCollection();
    } catch (error) {
      console.log(error);
    }
  }

  async fetchImages(id) {
    const isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;
    try {
      const abortController = new AbortController();
      const timeoutLimit = new Promise((_, reject) => {
        setTimeout(() => {
          abortController.abort();
          reject(new Error('Request timed out'));
        }, this.#TIME_FETCH_LIMIT);
      });

      const fetchImage = await fetch(
        `${this.#url}/random/${isMobile ? this.#dimensionsMobile : this.#dimensionsDesktop}?${
          state.currentTheme
        }-${id}`,
        { signal: abortController.signal }
      );
      const res = await Promise.race([timeoutLimit, fetchImage]);

      this.handleShowLoadPercentage();

      return res.url;
    } catch (error) {
      throw new Error('Cannot load an image! Try again or change in-game options', error);
    }
  }

  removeDuplicates(collection) {
    return collection.reduce((uniqueUrls, currentUrl) => {
      const urlParts = currentUrl.split('-');
      const urlPrefix = `${urlParts[0]}-${urlParts[1]}-`;
      const existingUrl = uniqueUrls.find((url) => url.startsWith(urlPrefix));
      if (!existingUrl) {
        uniqueUrls.push(currentUrl);
      }
      return uniqueUrls;
    }, []);
  }

  handleShowLoadPercentage() {
    this.#timesLoaded++;
    loader.showPercentage(Math.floor((this.#timesLoaded / this.#amountImagesToFetch) * 100));
  }

  set attemptsToFetch(num) {
    this.#attemptsToFetch = num;
  }

  resetFetchState() {
    this.#timesLoaded = 0;
    this.#attemptsToFetch = 0;
    this.#currentCollectionLength = 0;
    this.#collection = [];
  }

  #createPairs(url) {
    try {
      const img = new Image();
      const img2 = new Image();
      img.src = url;
      img2.src = url;
      return [img, img2];
    } catch (error) {
      throw new Error('Could not create an image pair!');
    }
  }
}
