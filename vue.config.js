module.exports = {
  publicPath: "./",
  chainWebpack: config => {
    config.performance.set("hints", false);
  },
  devServer: {
    disableHostCheck: true
  }
};
