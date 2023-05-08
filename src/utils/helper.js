export function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const rules = document.styleSheets[0].cssRules;
const hidden = Object.values(rules).find(({ selectorText }) => selectorText === '.hidden');
export const opacityTime = hidden.style.transitionDuration.slice(0, -1) * 1000;
