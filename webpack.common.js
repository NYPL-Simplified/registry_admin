const path = require("path");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

var config = {
  entry: {
    app: [
      "./src/stylesheets/app.scss", "./src/index.tsx"
    ]
  },
  stats: { warnings: false },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "registry-admin.js",
    library: "RegistryAdmin",
    libraryTarget: "umd"
  },
  plugins: [
    new CleanWebpackPlugin(),
    // Extract separate css file.
    new MiniCssExtractPlugin({ filename: "registry-admin.css" })
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, /__tests__/],
        loaders: ['ts-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg).*$/,
        loader: 'url-loader?limit=100000'
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"],
  }
};

module.exports = config;
