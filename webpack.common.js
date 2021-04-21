// webpack.common.js - common webpack config
const LEGACY_CONFIG = 'legacy';
const MODERN_CONFIG = 'modern';

// node modules
const path = require('path');
const merge = require('webpack-merge');

// webpack plugins
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

// config files
const pkg = require('./package.json');
const settings = require('./webpack.settings.js');

// Configure Babel loader
const configureBabelLoader = browserList => ({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            useBuiltIns: 'entry',
            targets: {
              browsers: browserList
            }
          }
        ],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        ['@babel/plugin-transform-runtime', { regenerator: true }],
        'dynamic-import-node'
      ]
    }
  }
});

// Configure Sass loader
const configureSassLoader = () => ({
  test: /\.sass$/,
  use: [
    {
      loader: 'style-loader'
    },
    {
      loader: 'css-loader',
      query: {
        sourceMap: true
      }
    },
    {
      loader: 'postcss-loader'
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true
      }
    }
  ]
});

const configureGraphQlLoader = () => ({
  test: /\.(graphql|gql)$/,
  exclude: /node_modules/,
  loader: 'graphql-tag/loader'
});

// Configure Entries
const configureEntries = () => {
  const entries = {};
  for (const [key, value] of Object.entries(settings.entries)) {
    entries[key] = path.resolve(__dirname, settings.paths.src.js + value);
  }

  return entries;
};

// Configure Font loader
const configureFontLoader = () => ({
  test: /\.(ttf|eot|woff2?)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]'
      }
    }
  ]
});

// Configure SVG loader
const configureSvgLoader = () => ({
  test: /\.svg$/,
  loader: 'file-loader'
});

// Configure Manifest
const configureManifest = fileName => ({
  fileName,
  basePath: settings.manifestConfig.basePath,
  map: file => {
    file.name = file.name.replace(/(\.[a-f0-9]{32})(\..*)$/, '$2');
    return file;
  }
});

// The base webpack config
const baseConfig = {
  name: pkg.name,
  entry: configureEntries(),
  output: {
    path: path.resolve(__dirname, settings.paths.dist.base),
    publicPath: settings.urls.publicPath
  },
  module: {
    rules: [
      configureFontLoader(),
      configureSassLoader(),
      configureGraphQlLoader(),
      configureSvgLoader()
    ]
  },
  plugins: [
    new WebpackNotifierPlugin({
      title: 'Webpack',
      excludeWarnings: true,
      alwaysNotify: true
    })
  ],
  node: {
    fs: 'empty' // allows Vimeo connection https://github.com/josephsavona/valuable/issues/9
  }
};

// Legacy webpack config
const legacyConfig = {
  module: {
    rules: [configureBabelLoader(Object.values(pkg.browserslist.legacyBrowsers))]
  },
  plugins: [new ManifestPlugin(configureManifest('manifest-legacy.json'))]
};

// Modern webpack config
const modernConfig = {
  module: {
    rules: [configureBabelLoader(Object.values(pkg.browserslist.modernBrowsers))]
  },
  plugins: [new ManifestPlugin(configureManifest('manifest.json'))]
};

// Common module exports
// noinspection WebpackConfigHighlighting
module.exports = {
  legacyConfig: merge(legacyConfig, baseConfig),
  modernConfig: merge(modernConfig, baseConfig),
  configureBabelLoader
};
