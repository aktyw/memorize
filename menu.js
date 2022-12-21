import { game } from './index.js';

export default class Menu {
  parent = document.body;
  menu;
  startBtn;
  scoreBtn;

  constructor() {
    this.init();
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

  renderBtns() {
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('btn-container')
    this.menu.appendChild(btnContainer)

    this.startBtn = document.createElement('button');
    this.startBtn.classList.add('btn', 'start-btn');
    this.startBtn.textContent = 'Start game';
    btnContainer.appendChild(this.startBtn);

    this.scoreBtn = document.createElement('button');
    this.scoreBtn.classList.add('btn', 'score-btn');
    this.scoreBtn.textContent = 'High Scores';
    btnContainer.appendChild(this.scoreBtn);
  }

  startGame() {
    this.menu.remove()
    game.init();
    game.startGame();
  }

  handleEvents() {
    this.startBtn.addEventListener('click', this.startGame.bind(this), {
      once: true,
    });
  }

}
