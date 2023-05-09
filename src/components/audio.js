import { Howl } from 'howler';
import { state } from '../state/state';

// eslint-disable-next-line node/no-missing-require
const lofiSong = require('url:../assets/music/lofi.mp3');
// eslint-disable-next-line node/no-missing-require
const clickOneSound = require('url:../assets/sounds/click_one.mp3');
// eslint-disable-next-line node/no-missing-require
const clickTwoSound = require('url:../assets/sounds/click_two.mp3');

export const menuSong = new Howl({
  src: [lofiSong],
  loop: true,
  onplay: function () {
    // `this` refers to the `menuSong` instance here
    // update the `musicBtn` text content to reflect the current state of the song
    state.music.isPlayInMenu = true;
  },
  onpause: () => (state.music.isPlayInMenu = false),
  volume: 0.6,
});

// export const buttonSoundOne = new Howl({
//   src: [clickOneSound],
//   volume: 0.3,
// });

export const buttonSound = new Howl({
  src: [clickTwoSound],
  volume: 0.3,
});
