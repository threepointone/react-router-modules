var path = require("path");

// var extractEntries = require('../lib/extractEntries').default
module.exports = {
  devtool: "source-map",
  entry: path.join(__dirname, "./index.js"),
  output: {
    path: __dirname,
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: { plugins: [ path.resolve("./src/babel.js") ] }
      }
    ]
  }
};

