import Menu from './components/menu';
import Images from './components/images';
export const menu = new Menu();
export const handleImages = new Images();
window.addEventListener('DOMContentLoaded', () => {
  handleImages.preload();
  menu.init();
});
