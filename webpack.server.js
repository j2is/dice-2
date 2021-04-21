// node modules
const path = require('path');

// config files
const settings = require('./webpack.settings.js');
require('ignore-styles');
require('url-loader');
require('file-loader');

require('@babel/register')({
  ignore: [/(node_modules)/],
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/syntax-dynamic-import', 'dynamic-import-node', 'react-loadable/babel']
});

require(path.resolve(__dirname, settings.paths.src.js + settings.serverEntry));
