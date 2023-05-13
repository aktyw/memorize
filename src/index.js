import Menu from './components/menu';
import Images from './components/images';
import { loader } from './components/loading';

export const menu = new Menu();
export const handleImages = new Images();

window.addEventListener('DOMContentLoaded', async () => {
  loader.showLoadingAssetsScreen();
  await handleImages.getCollection();
  menu.init();
  loader.destroyLoadingScreen();
});
