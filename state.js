const rules = document.styleSheets[0].cssRules;
const hidden = Object.values(rules).find(
  ({ selectorText }) => selectorText === '.hidden'
);
const opacityTime = hidden.style.transitionDuration.slice(0, -1) * 1000;

export const gameState = {
  points: 0,
  lives: 3,
  allCards: [],
  openCards: [],
  time: 1000,
  timeOpacity: opacityTime / 2,
  userShouldWait: false,
};
