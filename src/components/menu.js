import { game } from '../components/game';
import { state } from '../state/state.js';
import { menuSongs, buttonSound } from '../components/audio';
import { handleSound } from '../utils/handleSound.js';
import { makeEndTimeline, makeStartTimeline } from './animations.js';
import { fetchImages } from '../index';
import { loader } from './loading';

export default class Menu {
  parent = document.getElementById('game');
  menu;
  btnContainer;
  startBtn;
  scoreBtn;
  optionsBtn;
  menuBtn;
  soundsBtn;
  cardDeckBtn;
  cardDeckFetchBtn;
  musicBtn;
  nextSongBtn;
  loader;
  highScoreContainer;
  currentSongIndex = 0;
  menuSoundsState = 'disable sounds';
  menuMusicState = 'play music';
  difficulty = this.difficultyLevel;

  init() {
    this.generateMenu();
    this.renderBtns();
    this.handeSoundEvents();
    this.updateScoresFromStorage();
  }

  render(el = 'div', classlist = [], text, parent = this.btnContainer) {
    const element = document.createElement(el);
    parent.appendChild(element);
    if (classlist) element.classList.add(...classlist);
    if (text) element.textContent = text;
    return element;
  }

  generateMenu() {
    this.menu = this.render('div', ['menu'], null, this.parent);
    const titleContainer = this.render('div', ['menu-title-container'], null, this.menu);
    this.render('h1', ['menu-title'], 'Memorize', titleContainer);
    this.btnContainer = this.render('div', ['btn-container'], null, this.menu);
  }

  renderBtns() {
    this.startBtn = this.render('button', ['btn', 'btn-menu', 'btn-start'], 'Start game');
    this.optionsBtn = this.render('button', ['btn', 'btn-menu', 'btn-options'], 'Options');
    this.scoreBtn = this.render('button', ['btn', 'btn-menu'], 'High scores');

    this.handleEvents();
  }

  renderOptionBtns() {
    this.setAudioState();

    this.render('h2', ['menu-subtitle'], 'Difficulty');
    this.difficulty = this.render('button', ['btn', 'btn-difficulty'], this.difficultyLevel);

    this.render('h2', ['menu-subtitle'], 'Audio');
    this.soundsBtn = this.render(
      'button',
      [...this.getAudioBtnClass('isSoundsActive'), 'btn-sounds'],
      this.menuSoundsState
    );
    this.musicBtn = this.render('button', [...this.getAudioBtnClass('isPlayMusic'), 'btn-music'], this.menuMusicState);
    this.nextSongBtn = this.render('button', ['btn', 'btn-next-song'], 'Next song');

    this.render('h2', ['menu-subtitle'], 'Card deck');
    this.cardDeckBtn = this.render('button', ['btn', 'btn-card-deck'], state.currentTheme);
    this.cardDeckFetchBtn = this.render('button', ['btn', 'btn-card-deck-fetch', 'btn-menu-active'], 'get theme');

    this.menuBtn = this.render('button', ['btn', 'btn-menu', 'btn-back'], 'main menu');

    this.cardDeckBtn.addEventListener('click', this.changeCardDeck.bind(this));
    this.cardDeckFetchBtn.addEventListener('click', this.handleFetchNewCardDeck.bind(this));
    this.soundsBtn.addEventListener('click', this.toggleSounds.bind(this));
    this.difficulty.addEventListener('click', this.handleChangeDifficulty.bind(this));
    this.musicBtn.addEventListener('click', this.toggleMusic.bind(this));
    this.nextSongBtn.addEventListener('click', this.playNextSong.bind(this));
    this.menuBtn.addEventListener('click', this.showMainMenu.bind(this));
  }

  renderLoader() {
    this.loader = document.createElement('span');
    this.loader.classList.add('loader', 'loader-small');
    this.cardDeckFetchBtn.appendChild(this.loader);
  }

  destroyLoader() {
    this.cardDeckFetchBtn.removeChild(this.loader);
  }

  async handleFetchNewCardDeck() {
    this.cardDeckFetchBtn.setAttribute('disabled', true);
    this.renderLoader();
    fetchImages.resetFetchState();
    await fetchImages.getCollection();
    this.destroyLoader();
    this.cardDeckFetchBtn.removeAttribute('disabled');
  }

  changeCardDeck() {
    const currentIndex = state.themes.findIndex((el) => el === state.currentTheme);

    const nextIndex = (currentIndex + 1) % state.themes.length;

    state.currentTheme = state.themes[nextIndex];

    this.cardDeckBtn.textContent = state.currentTheme;
  }

  renderHighScoresBtns() {
    this.render('h2', ['menu-subtitle'], 'High scores');
    this.highScoreContainer = this.render('div', ['high-score-container']);
    if (state.highScores) {
      state.highScores?.forEach(({ name, score }, pos) => {
        const markup = `
        <div class="score-container">
          <span class="score-pos">${pos + 1}</span>
          <div class="score-flex">
            <span>${name}</span>
            <span>${score}</span>
          </div>
        </div>
      `;
        this.highScoreContainer.insertAdjacentHTML('beforeend', markup);
      });
    }

    this.menuBtn = this.render('button', ['btn', 'btn-menu', 'btn-menu'], 'main menu');

    this.menuBtn.addEventListener('click', this.showMainMenu.bind(this));
  }

  startMusic() {
    menuSongs[this.currentSongIndex].play();
    state.audio.isPlayMusic = true;

    this.musicBtn.textContent = 'stop music';
    this.musicBtn.classList.add('btn-menu-active');
  }

  pauseMusic() {
    menuSongs[this.currentSongIndex].pause();
    state.audio.isPlayMusic = false;

    if (this.musicBtn) {
      this.musicBtn.textContent = 'play music';
      this.musicBtn.classList.remove('btn-menu-active');
    }
  }

  toggleMusic() {
    state.audio.isPlayMusic ? this.pauseMusic() : this.startMusic();
  }

  playNextSong() {
    this.pauseMusic();
    (this.currentSongIndex + 1) % menuSongs.length === 0 ? (this.currentSongIndex = 0) : this.currentSongIndex++;
    this.startMusic();
  }

  enableSounds() {
    state.audio.isSoundsActive = true;

    this.soundsBtn.textContent = 'Disable sounds';
    this.soundsBtn.classList.add('btn-menu-active');
  }

  disableSounds() {
    state.audio.isSoundsActive = false;

    this.soundsBtn.textContent = 'Enable sounds';
    this.soundsBtn.classList.remove('btn-menu-active');
  }

  toggleSounds() {
    state.audio.isSoundsActive ? this.disableSounds() : this.enableSounds();
  }

  playButtonMenuSound() {
    handleSound(buttonSound);
  }

  handlePlaySound(e) {
    if (!e.target.closest('.btn')) return;

    this.playButtonMenuSound();
  }

  setAudioState() {
    this.setMusicState();
    this.setSoundState();
  }

  setMusicState() {
    state.audio.isPlayMusic ? (this.menuMusicState = 'stop music') : (this.menuMusicState = 'play music');
  }

  setSoundState() {
    state.audio.isSoundsActive ? (this.menuSoundsState = 'Disable sounds') : (this.menuSoundsState = 'Enable sounds');
  }

  getAudioBtnClass(prop) {
    return state.audio[prop] ? ['btn', 'btn-menu', 'btn-menu-active'] : ['btn', 'btn-menu'];
  }

  get difficultyLevel() {
    return state.currentDifficulty;
  }

  handleChangeDifficulty() {
    state.changeDifficulty();
    this.difficulty.textContent = this.difficultyLevel;
  }

  startGame() {
    try {
      console.log(state.AMOUNT_IMAGES_REQUIRED);
      console.log(state.imageCollection.length);
      console.log(this.isNotEnoughImages());
      if (this.isNotEnoughImages()) {
        throw new Error(
          `${state.imageCollection.length} loaded. Need ${state.AMOUNT_IMAGES_REQUIRED} images to start the game. Game will try to fetch images one time. If it fail, check internet connection, restart the game or change card deck in options`
        );
      }

      makeStartTimeline();
      setTimeout(() => {
        this.destroyMenu();
        game.startGame();
        makeEndTimeline();
      }, state.START_ANIMATION_TIME);
    } catch (error) {
      this.handleFallbackFetch(error);
      console.log(error);
    }
  }

  isNotEnoughImages() {
    return state.imageCollection.length < state.AMOUNT_IMAGES_REQUIRED;
  }

  async handleFallbackFetch(err) {
    try {
      this.showError(err);
      loader.showLoadingAssetsScreen();
      await fetchImages.getCollection();
      loader.destroyLoadingScreen();
      if (state.AMOUNT_IMAGES_REQUIRED) {
        this.startGame();
      }
    } catch (error) {
      console.log(error);
    }
  }

  showError(err) {
    this.menu.insertAdjacentHTML('afterbegin', err);
  }

  destroyMenu() {
    this.removeListeners();
    this.menu.innerHTML = '';
    this.menu.remove();
  }

  showOptions() {
    this.clearContainer();
    this.renderOptionBtns();
  }

  showHighScores() {
    this.clearContainer();
    this.updateScoresFromStorage();
    this.renderHighScoresBtns();
  }

  updateScoresFromStorage() {
    const highScores = window.localStorage.getItem('highScores');
    if (!highScores) return;
    state.highScores = JSON.parse(window.localStorage.getItem('highScores'));
  }

  showMainMenu() {
    this.clearContainer();
    this.renderBtns();
  }

  clearContainer() {
    this.removeListeners();
    this.btnContainer.innerHTML = '';
  }

  removeListeners() {
    this.optionsBtn.removeEventListener('click', this.showOptions);
    this.scoreBtn.removeEventListener('click', this.showHighScores);
  }

  handeSoundEvents() {
    this.parent.addEventListener('click', this.handlePlaySound.bind(this));
  }

  handleEvents() {
    this.startBtn.addEventListener('click', this.startGame.bind(this), {
      once: true,
    });
    this.optionsBtn.addEventListener('click', this.showOptions.bind(this));
    this.scoreBtn.addEventListener('click', this.showHighScores.bind(this));
  }
}
