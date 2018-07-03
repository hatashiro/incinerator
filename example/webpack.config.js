module.exports = {
  mode: "production",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          fix: true
        }
      }
    ]
  }
};
