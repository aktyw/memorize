import { Howl } from 'howler';
import { state } from '../state/state';

// eslint-disable-next-line node/no-missing-require
const lofiSong = require('url:../assets/music/lofi.mp3');

export const menuSong = new Howl({
  src: [lofiSong],
  loop: true,
  onplay: function () {
    // `this` refers to the `menuSong` instance here
    // update the `musicBtn` text content to reflect the current state of the song
    state.music.isPlayInMenu = true
    const menu = document.querySelector('.menu');
    const musicBtn = menu.querySelector('.music-btn');
    musicBtn.textContent = 'music off';
  },
  onpause: () => (state.music.isPlayInMenu = false),
  volume: 0.8,
});
