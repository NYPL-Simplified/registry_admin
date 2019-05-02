const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

var config = {
  entry: {
    app: [
      "./src/stylesheets/app.scss", "./src/index.tsx"
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "registry-admin.js",
    library: "RegistryAdmin",
    libraryTarget: "umd"
  },
  plugins: [
    // jsdom is required by opds-web-client for server rendering, but causes
    // errors in the browser even if it is never used, so we ignore it:
    new webpack.IgnorePlugin(/jsdom$/),

    // Extract separate css file.
    new MiniCssExtractPlugin({ filename: "registry-admin.css" })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg).*$/,
        loader: 'url-loader?limit=100000'
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"],
  },
  externals: {
    'window': 'window',
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'react/addons': true
  }
};

module.exports = config;
