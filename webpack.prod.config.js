var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    app: [
      "./src/stylesheets/app.scss", "./src/index.tsx"
    ]
  },
  output: {
    path: "./dist",
    publicPath: "/",
    filename: "registry-admin.js",
    library: "RegistryAdmin",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV) }),
    // jsdom is required by opds-web-client for server rendering, but causes
    // errors in the browser even if it is never used, so we ignore it:
    new webpack.IgnorePlugin(/jsdom$/),

    // Extract separate css file.
    new ExtractTextPlugin("registry-admin.css")
  ],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader!css-loader")
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg).*$/,
        loader: 'url-loader?limit=100000'
      }
    ],
  },
  resolve: {
    extensions: ["", ".js", ".ts", ".tsx", ".scss"],
    root: path.resolve(__dirname, "node_modules")
  },
  externals: {
    'window': 'window',
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'react/addons': true
  },
  devServer: {
    historyApiFallback: true
  }
};

module.exports = config;
