const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = function (options) {
  // Adiciona o plugin para resolver caminhos personalizados
  if (options.resolve.plugins) {
    options.resolve.plugins.push(new TsconfigPathsPlugin());
  } else {
    options.resolve.plugins = [new TsconfigPathsPlugin()];
  }

  return options;
};
