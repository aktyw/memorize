import { Howl } from 'howler';
import { state } from '../state/state';

// eslint-disable-next-line node/no-missing-require
const lofiSong = require('url:../assets/music/lofi.mp3');
// eslint-disable-next-line node/no-missing-require
const clickTwoSound = require('url:../assets/sounds/click_two.mp3');

export const menuSong = new Howl({
  src: [lofiSong],
  loop: true,
  autoplay: false,
  onplay: function () {
    state.audio.isPlayInMenu = true;
  },
  onpause: () => (state.audio.isPlayInMenu = false),
  volume: 0.6,
});

export const buttonSound = new Howl({
  src: [clickTwoSound],
  autoplay: false,
  volume: 0.3,
});
