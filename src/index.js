const mergeDekoratorParts = require('./decorator-functions').mergeDekoratorParts;
const fetchDekoratorParts = require('./decorator-functions').fetchDekoratorParts;
const consoleOnce = require('./console-once');

class NavDecoratorWebpackPlugin {

  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const options = this.options;

    compiler.hooks.compilation.tap('NavDecoratorWebpackPlugin', (compilation) => {
      const htmlWebpackPlugin = compiler.options.plugins.map(({constructor}) => constructor).
          find(({name}) => name === 'HtmlWebpackPlugin');
      if (htmlWebpackPlugin) {
        htmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
            'NavDecoratorWebpackPlugin',
            (data, cb) => {
              fetchDekoratorParts(options.dekorator || {}, options.overrideEnvSrc).then(parts => {
                data.html = mergeDekoratorParts(data.html, parts);
                cb(null, data);
              });
            },
        );
      } else {
        consoleOnce.warn('> NavDecoratorWebpackPlugin require the HtmlWebpackPlugin to be installed.');
      }
    });
  }
}

module.exports = NavDecoratorWebpackPlugin;

