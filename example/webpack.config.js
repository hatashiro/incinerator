let { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

let isWatching = process.argv.includes("--watch");
let isAnalyzing = process.argv.includes("--analyze");

module.exports = {
  plugins: isAnalyzing ? [
    new BundleAnalyzerPlugin()
  ] : []
};
