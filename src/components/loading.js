export default class Loader {
  #loadingContainer;
  #loaderTitle;

  showLoadingAssetsScreen() {
    this.#loadingContainer = document.createElement('div');
    const screen = document.createElement('div');
    const loader = document.createElement('span');
    this.#loaderTitle = document.createElement('h1');

    document.body.appendChild(this.#loadingContainer);
    this.#loadingContainer.appendChild(screen);
    screen.appendChild(loader);
    screen.appendChild(this.#loaderTitle);

    this.#loadingContainer.classList.add('loading-container');
    screen.classList.add('loading-screen');
    loader.classList.add('loader');
    this.#loaderTitle.classList.add('loader-title');

    this.#loaderTitle.textContent = `Loading 0%`;
  }

  showPercentage(percentage) {
    this.#loaderTitle.textContent = `Loading ${percentage}%`;
  }

  getErrorTemplate(error) {
    return `<span class="error-info">${error}</span>`;
  }

  destroyLoadingScreen() {
    document.body.removeChild(this.#loadingContainer);
  }
}

export const loader = new Loader();
