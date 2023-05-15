import Menu from './components/menu';
import Images from './components/images';
import { loader } from './components/loading';

export const menu = new Menu();
export const fetchImages = new Images();

window.addEventListener('DOMContentLoaded', async () => {
  loader.showLoadingAssetsScreen();
  await fetchImages.getCollection();
  loader.destroyLoadingScreen();
  menu.init();
});
