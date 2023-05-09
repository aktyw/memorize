import { Howl } from 'howler';
import { state } from '../state/state';

// eslint-disable-next-line node/no-missing-require
const lofiSong = require('url:../assets/music/lofi.mp3');
// eslint-disable-next-line node/no-missing-require
const clickTwoSound = require('url:../assets/sounds/click_two.mp3');
// eslint-disable-next-line node/no-missing-require
const retroOneSong = require('url:../assets/music/retro_80.mp3');
// eslint-disable-next-line node/no-missing-require
const retroTwoSong = require('url:../assets/music/retro_one.mp3');
// eslint-disable-next-line node/no-missing-require
const retroThreeSong = require('url:../assets/music/retro_synth.mp3');

const songs = [lofiSong, retroOneSong, retroTwoSong, retroThreeSong];

export const menuSongs = songs.map(
  (song) =>
    new Howl({
      src: [song],
      autoplay: false,
      onplay: function () {
        state.audio.isPlayMusic = true;
      },
      onpause: () => (state.audio.isPlayMusic = false),
      onend: () => {
        console.log('Finish', this);
      },
      volume: 0.5,
    })
);

export const buttonSound = new Howl({
  src: [clickTwoSound],
  autoplay: false,
  volume: 0.3,
});
