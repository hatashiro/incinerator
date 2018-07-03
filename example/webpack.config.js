let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

let isWatching = process.argv.includes("--watch");

module.exports = {
  plugins: isWatching ? [] : [
    new BundleAnalyzerPlugin()
  ]
};
