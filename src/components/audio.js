import { Howl } from 'howler';
import { state } from '../state/state';
import { menu } from '../components/menu';
// eslint-disable-next-line node/no-missing-require
const lofiSong = require('url:../assets/music/lofi.mp3');
// eslint-disable-next-line node/no-missing-require
const clickTwoSound = require('url:../assets/sounds/click_two.mp3');
// eslint-disable-next-line node/no-missing-require
const retroOneSong = require('url:../assets/music/retro_80.mp3');
// eslint-disable-next-line node/no-missing-require
const retroThreeSong = require('url:../assets/music/retro_synth.mp3');
// eslint-disable-next-line node/no-missing-require
const cardWhoosh = require('url:../assets/sounds/whoosh.mp3');
// eslint-disable-next-line node/no-missing-require
const cardSuccess = require('url:../assets/sounds/interface.mp3'); // eslint-disable-next-line node/no-missing-require
const nextLevel = require('url:../assets/sounds/success.mp3');

const songs = [lofiSong, retroOneSong, retroThreeSong];

export const menuSongs = songs.map(
  (song) =>
    new Howl({
      src: [song],
      autoplay: false,
      onplay: function () {
        state.audio.isPlayMusic = true;
      },
      onpause: () => (state.audio.isPlayMusic = false),
      onend: function () {
        menu.playNextSong();
      },
      volume: 0.5,
    })
);

export const flipCardSound = new Howl({
  src: [cardWhoosh],
  autoplay: false,
  volume: 0.2,
});

export const cardSuccessSound = new Howl({
  src: [cardSuccess],
  autoplay: false,
  volume: 0.1,
});

export const nextLevelSound = new Howl({
  src: [nextLevel],
  autoplay: false,
  volume: 0.2,
});

export const buttonSound = new Howl({
  src: [clickTwoSound],
  autoplay: false,
  volume: 0.3,
});
