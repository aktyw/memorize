export function createElements(...tags) {
  return tags.map(tag => document.createElement(tag));
}