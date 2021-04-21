// webpack.settings.js - webpack settings config

// node modules
require("dotenv").config();

// Webpack settings exports
// noinspection WebpackConfigHighlighting
module.exports = {
  name: "Dice",
  copyright: "Jai Sandhu",
  paths: {
    src: {
      base: "./src/",
      css: "./src/css/",
      js: "./src/js/",
    },
    dist: {
      base: "./web/dist/",
      clean: ["./img", "./criticalcss", "./css", "./js"],
    },
    templates: "./templates/",
  },
  urls: {
    live: "https://diceconsult.co.uk/",
    local: "http://dice.test/",
    critical: "http://dice.test/",
    publicPath: "/dist/",
  },
  vars: {
    cssName: "styles",
  },
  entries: {
    client: "client.js",
  },
  serverEntry: "server.js",
  schemaEntry: "schema.js",
  criticalCssConfig: {
    base: "./web/dist/criticalcss/",
    suffix: "_critical.min.css",
    criticalHeight: 1200,
    criticalWidth: 1200,
    ampPrefix: "amp_",
    ampCriticalHeight: 19200,
    ampCriticalWidth: 600,
    pages: [
      {
        url: "",
        template: "index",
      },
    ],
  },
  devServerConfig: {
    public: () => process.env.DEVSERVER_PUBLIC || "http://localhost:8080",
    host: () => process.env.DEVSERVER_HOST || "localhost",
    poll: () => process.env.DEVSERVER_POLL || false,
    port: () => process.env.DEVSERVER_PORT || 8080,
    https: () => process.env.DEVSERVER_HTTPS || false,
  },
  manifestConfig: {
    basePath: "",
  },
  purgeCssConfig: {
    paths: ["./templates/**/*.{twig,html}", "./src/vue/**/*.{vue,html}"],
    whitelist: ["./src/css/components/**/*.{css,pcss}"],
    whitelistPatterns: [],
    extensions: ["html", "js", "twig", "vue"],
  },
  saveRemoteFileConfig: [
    {
      url: "https://www.google-analytics.com/analytics.js",
      filepath: "js/analytics.js",
    },
  ],
  createSymlinkConfig: [
    {
      origin: "img/favicons/favicon.ico",
      symlink: "../favicon.ico",
    },
  ],
};
