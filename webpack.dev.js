// webpack.dev.js - developmental builds
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const merge = require('webpack-merge');
const path = require('path');
const sane = require('sane');
const webpack = require('webpack');

// config files
// const errorOverlayMiddleware = require('react-error-overlay/middleware');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const common = require('./webpack.common.js');
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure the webpack-dev-server
const configureDevServer = buildType => ({
  public: settings.devServerConfig.public(),
  contentBase: path.resolve(__dirname, settings.paths.templates),
  host: settings.devServerConfig.host(),
  port: settings.devServerConfig.port(),
  https: !!parseInt(settings.devServerConfig.https()),
  quiet: true,
  hot: true,
  hotOnly: true,
  overlay: true,
  disableHostCheck: true,
  stats: 'errors-only',
  watchOptions: {
    poll: !!parseInt(settings.devServerConfig.poll())
  },
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  // Use sane to monitor all of the templates files and sub-directories
  before: (app, server) => {
    const watcher = sane(path.join(__dirname, settings.paths.templates), {
      glob: ['**/*'],
      poll: !!parseInt(settings.devServerConfig.poll())
    });
    watcher.on('change', (filePath, root, stat) => {
      console.log('  File modified:', filePath);
      server.sockWrite(server.sockets, 'content-changed');
    });
  }
});

// Development module exports
module.exports = [
  merge(common.legacyConfig, {
    output: {
      filename: path.join('./js', '[name]-[hash].legacy.js'),
      publicPath: `${settings.devServerConfig.public()}/`
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: configureDevServer(LEGACY_CONFIG),
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ErrorOverlayPlugin(),
      new webpack.DefinePlugin({
        // prettier-ignore
        'process.env.ENVIRONMENT': JSON.stringify('dev')
      })
    ]
  }),
  merge(common.modernConfig, {
    output: {
      filename: path.join('./js', '[name]-[hash].js'),
      publicPath: `${settings.devServerConfig.public()}/`
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: configureDevServer(MODERN_CONFIG),
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ErrorOverlayPlugin(),
      new webpack.DefinePlugin({
        // prettier-ignore
        'process.env.ENVIRONMENT': JSON.stringify('dev')
      })
    ]
  })
];
