const cache = {};
const consoleOnce = (message, severity) => {
  if (!cache[message]) {
    console[severity](message);
    cache[message] = true;
  }
};

module.exports = {
  warn: (message) => consoleOnce(message, 'warn'),
  log: (message) => consoleOnce(message, 'log'),
  info: (message) => consoleOnce(message, 'info'),
};
