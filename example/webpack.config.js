let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

let isWatching = process.argv.includes("--watch");
let isAnalyzing = process.argv.includes("--analyze");

module.exports = {
  watchOptions: {
    aggregateTimeout: 2000
  },
  plugins: isAnalyzing ? [
    new BundleAnalyzerPlugin()
  ] : []
};
