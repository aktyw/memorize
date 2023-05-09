import { game } from '../index.js';
import { state } from '../state/state.js';
import { menuSong } from '../components/audio';
export default class Menu {
  parent = document.body;
  menu;
  startBtn;
  scoreBtn;
  optionsBtn;
  musicBtn;
  menuMusicState = 'music on';

  constructor() {
    this.init();
    if (state.music.isPlayInMenu) {
      this.menuMusicState = 'music off';
    } else {
      this.menuMusicState = 'music on';
    }
  }

  init() {
    this.generateMenu();
    this.renderBtns();
    this.handleEvents();
  }

  generateMenu() {
    this.menu = document.createElement('div');
    this.menu.classList.add('menu');
    this.parent.appendChild(this.menu);

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('menu-title-container');
    this.menu.appendChild(titleContainer);

    const title = document.createElement('h1');
    title.textContent = 'Memorize';
    title.classList.add('menu-title');
    titleContainer.appendChild(title);
  }

  render(el, classlist, parent, text) {
    const element = document.createElement(el);
    parent.appendChild(element);
    element.classList.add(...classlist);
    if (text) element.textContent = text;
    return element;
  }

  renderBtns() {
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container');
    this.menu.appendChild(btnContainer);

    this.startBtn = this.render('button', ['btn', 'start-btn'], btnContainer, 'Start game');
    this.optionsBtn = this.render('button', ['btn', 'options-btn'], btnContainer, 'Options');
    this.scoreBtn = this.render('button', ['btn'], btnContainer, 'High scores');
    this.musicBtn = this.render('button', ['btn', 'music-btn'], btnContainer, this.menuMusicState);
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
      this.musicBtn.textContent = 'Music Off';
    } catch (error) {
      console.log(error);
    }
  }

  pauseMusic() {
    menuSong.pause();
    state.music.isPlayInMenu = false;
    this.musicBtn.textContent = 'Music On';
  }

  toggleMusic() {
    if (state.music.isPlayInMenu) {
      this.pauseMusic();
    } else this.startMusic();
  }

  showOptions() {
    console.log('Show Opts');
  }

  showHighScores() {
    console.log('Show HS');
  }

  handleEvents() {
    this.startBtn.addEventListener('click', this.startGame.bind(this), {
      once: true,
    });
    this.optionsBtn.addEventListener('click', this.showOptions.bind(this), {
      once: true,
    });
    this.scoreBtn.addEventListener('click', this.showHighScores.bind(this), {
      once: true,
    });
    this.musicBtn.addEventListener('click', this.toggleMusic.bind(this));
  }
}
