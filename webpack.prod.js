// webpack.prod.js - production builds
const LEGACY_CONFIG = "legacy";
const MODERN_CONFIG = "modern";

// node modules
const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
const Visualizer = require("webpack-visualizer-plugin");

// webpack plugins
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

// config files
const common = require("./webpack.common.js");
const pkg = require("./package.json");
const settings = require("./webpack.settings.js");

// Production module exports
module.exports = [
  merge(common.legacyConfig, {
    output: {
      filename: path.join("./js", "[name]-legacy.[chunkhash].js")
    },
    mode: "production",
    devtool: "source-map"
  }),
  merge(common.modernConfig, {
    output: {
      filename: path.join("./js", "[name].[chunkhash].js")
    },
    mode: "production",
    devtool: "source-map",
    // resolve: {
    //   alias: {
    //     "react-dom$": "react-dom/profiling",
    //     "scheduler/tracing": "scheduler/tracing-profiling"
    //   }
    // },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new Visualizer({
        filename: "../../reports/statistics.html"
      })
    ]
  })
];
