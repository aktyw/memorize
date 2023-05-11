import Menu from './components/menu';
export const menu = new Menu();

window.addEventListener('DOMContentLoaded', () => {
  menu.init();
});
