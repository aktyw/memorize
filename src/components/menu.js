import { game } from '../index.js';
import { state } from '../state/state.js';
import { menuSongs, buttonSound } from '../components/audio';
import { handleSound } from '../utils/handleSound.js';
import { makeEndTimeline, makeStartTimeline } from './animations.js';

class Menu {
  parent = document.getElementById('game');
  menu;
  btnContainer;
  startBtn;
  scoreBtn;
  optionsBtn;
  menuBtn;
  soundsBtn;
  musicBtn;
  nextSongBtn;
  currentSongIndex = 0;
  menuSoundsState = 'disable sounds';
  menuMusicState = 'play music';
  difficulty = this.difficultyLevel;

  constructor() {
    this.init();
  }

  init() {
    this.generateMenu();
    this.renderBtns();
    this.handeSoundEvents();
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

    this.menuBtn = this.render('button', ['btn', 'btn-menu', 'btn-back'], 'main menu');

    this.soundsBtn.addEventListener('click', this.toggleSounds.bind(this));
    this.difficulty.addEventListener('click', this.handleChangeDifficulty.bind(this));
    this.musicBtn.addEventListener('click', this.toggleMusic.bind(this));
    this.nextSongBtn.addEventListener('click', this.playNextSong.bind(this));
    this.menuBtn.addEventListener('click', this.showMainMenu.bind(this));
  }

  renderHighScoresBtns() {
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
    makeStartTimeline();
    setTimeout(() => {
      this.menu.remove();
      game.startGame();
      this.pauseMusic();
      makeEndTimeline()
    }, state.START_ANIMATION_TIME);
  }

  showOptions() {
    this.clearContainer();
    this.renderOptionBtns();
  }

  showHighScores() {
    this.clearContainer();
    this.renderHighScoresBtns();
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

export const menu = new Menu();
