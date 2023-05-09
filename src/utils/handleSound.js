import { state } from '../state/state';

export function handleSound(sound) {
  if (!state.audio.isSoundsActive) return;

  sound.play();
}
