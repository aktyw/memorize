import { game } from '../index.js';
import { state } from '../state/state.js';
import { menuSongs, buttonSound } from '../components/audio';
import { handleSound } from '../utils/handleSound.js';

class Menu {
  parent = document.body;
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

  render(el = 'div', classlist = [], parent = this.btnContainer, text) {
    const element = document.createElement(el);
    parent.appendChild(element);
    if (classlist) element.classList.add(...classlist);
    if (text) element.textContent = text;
    return element;
  }

  generateMenu() {
    this.menu = document.createElement('div');
    this.menu.classList.add('menu');
    this.parent.appendChild(this.menu);

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('menu-title-container');
    this.menu.appendChild(titleContainer);

    this.btnContainer = document.createElement('div');
    this.btnContainer.classList.add('btn-container');
    this.menu.appendChild(this.btnContainer);

    const title = document.createElement('h1');
    title.textContent = 'Memorize';
    title.classList.add('menu-title');
    titleContainer.appendChild(title);
  }

  renderBtns() {
    this.startBtn = this.render('button', ['btn', 'btn-menu', 'btn-start'], this.btnContainer, 'Start game');
    this.optionsBtn = this.render('button', ['btn', 'btn-menu', 'btn-options'], this.btnContainer, 'Options');
    this.scoreBtn = this.render('button', ['btn', 'btn-menu'], this.btnContainer, 'High scores');

    this.handleEvents();
  }

  renderOptionBtns() {
    this.setAudioState();
    this.render('h2', ['menu-subtitle'], this.btnContainer, 'Difficulty');
    this.difficulty = this.render('button', ['btn', 'btn-difficulty'], this.btnContainer, this.difficultyLevel);
    this.render('h2', ['menu-subtitle'], this.btnContainer, 'Audio');

    this.soundsBtn = this.render(
      'button',
      [...this.getAudioBtnClass('isSoundsActive'), 'btn-sounds'],
      this.btnContainer,
      this.menuSoundsState
    );
    this.musicBtn = this.render(
      'button',
      [...this.getAudioBtnClass('isPlayMusic'), 'btn-music'],
      this.btnContainer,
      this.menuMusicState
    );
    this.nextSongBtn = this.render('button', ['btn', 'btn-next-song'], this.btnContainer, 'Next song');
    this.menuBtn = this.render('button', ['btn', 'btn-menu', 'btn-back'], this.btnContainer, 'main menu');

    this.soundsBtn.addEventListener('click', this.toggleSounds.bind(this));
    this.difficulty.addEventListener('click', this.handleChangeDifficulty.bind(this));
    this.musicBtn.addEventListener('click', this.toggleMusic.bind(this));
    this.nextSongBtn.addEventListener('click', this.playNextSong.bind(this));
    this.menuBtn.addEventListener('click', this.showMainMenu.bind(this));
  }

  renderHighScoresBtns() {
    this.menuBtn = this.render('button', ['btn', 'btn-menu', 'btn-menu'], this.btnContainer, 'main menu');

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
    if (state.audio.isSoundsActive) {
      this.disableSounds();
    } else this.enableSounds();
  }

  playButtonMenuSound() {
    handleSound(buttonSound);
  }

  handlePlaySound(e) {
    if (e.target.closest('.btn')) {
      this.playButtonMenuSound();
    }
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

  showOptions() {
    this.clearContainer();
    this.renderOptionBtns();
  }

  get difficultyLevel() {
    return state.currentDifficulty;
  }

  handleChangeDifficulty() {
    state.changeDifficulty();
    this.difficulty.textContent = this.difficultyLevel;
  }

  showMainMenu() {
    this.clearContainer();
    this.renderBtns();
  }

  showHighScores() {
    this.clearContainer();
    this.renderHighScoresBtns();
  }

  clearContainer() {
    this.removeListeners();
    this.btnContainer.innerHTML = '';
  }

  startGame() {
    this.menu.remove();
    game.startGame();
    this.pauseMusic();
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
