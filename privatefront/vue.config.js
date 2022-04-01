module.exports = {
  configureWebpack: {
    devServer: {
      port: '8081'
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/panel/'
    : '/'
}