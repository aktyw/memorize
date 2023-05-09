import { game } from '../index.js';
import { state } from '../state/state.js';
import { menuSong, buttonSound } from '../components/audio';

export default class Menu {
  parent = document.body;
  menu;
  btnContainer;
  startBtn;
  scoreBtn;
  optionsBtn;
  menuBtn;
  soundsBtn;
  musicBtn;
  menuSoundsState = 'sounds on';
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

  render(el = 'div', classlist, parent = this.btnContainer, text) {
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
    this.startBtn = this.render('button', ['btn', 'btn-menu', 'start-btn'], this.btnContainer, 'Start game');
    this.optionsBtn = this.render('button', ['btn', 'btn-menu', 'options-btn'], this.btnContainer, 'Options');
    this.scoreBtn = this.render('button', ['btn', 'btn-menu'], this.btnContainer, 'High scores');

    this.setMusicState();
    this.musicBtn = this.render('button', this.musicBtnClass, this.btnContainer, this.menuMusicState);
    this.handleEvents();
  }

  renderOptionBtns() {
    this.render('h2', ['menu-subtitle'], this.btnContainer, 'Change difficulty');
    this.difficulty = this.render('button', ['btn', 'difficulty-btn'], this.btnContainer, this.difficultyLevel);
    this.soundsBtn = this.render('button', ['btn', 'btn-menu', 'sounds-btn'], this.btnContainer, this.menuSoundsState);
    this.menuBtn = this.render('button', ['btn', 'btn-menu', 'menu-btn'], this.btnContainer, 'main menu');
    this.difficulty.addEventListener('click', this.handleChangeDifficulty.bind(this));
    this.menuBtn.addEventListener('click', this.showMainMenu.bind(this));
  }

  renderHighScoresBtns() {
    this.menuBtn = this.render('button', ['btn', 'btn-menu', 'menu-btn'], this.btnContainer, 'main menu');

    this.menuBtn.addEventListener('click', this.showMainMenu.bind(this));
  }

  startGame() {
    this.menu.remove();
    game.startGame();
    this.pauseMusic();
  }

  startMusic() {
    try {
      menuSong.play();
      state.music.isPlayInMenu = true;
      this.musicBtn.textContent = 'stop music';
      this.musicBtn.classList.add('btn-menu-active');
    } catch (error) {
      console.log(error);
    }
  }

  pauseMusic() {
    menuSong.pause();
    state.music.isPlayInMenu = false;
    this.musicBtn.textContent = 'play music';
    this.musicBtn.classList.remove('btn-menu-active');
  }

  toggleMusic() {
    if (state.music.isPlayInMenu) {
      this.pauseMusic();
    } else this.startMusic();
  }

  setMusicState() {
    state.music.isPlayInMenu ? (this.menuMusicState = 'stop music') : (this.menuMusicState = 'play music');
  }

  get musicBtnClass() {
    return state.music.isPlayInMenu
      ? ['btn', 'btn-menu', 'music-btn', 'btn-menu-active']
      : ['btn', 'btn-menu', 'music-btn'];
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

  playButtonMenuSound() {
    buttonSound.play();
  }

  handlePlaySound(e) {
    if (e.target.closest('.btn')) {
      this.playButtonMenuSound();
    }
  }

  removeListeners() {
    this.optionsBtn.removeEventListener('click', this.showOptions);
    this.scoreBtn.removeEventListener('click', this.showHighScores);
    this.musicBtn.removeEventListener('click', this.toggleMusic);
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
    this.musicBtn.addEventListener('click', this.toggleMusic.bind(this));
  }
}
