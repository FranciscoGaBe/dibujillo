const webpack = require('webpack')

module.exports = {
  configureWebpack: config => {

    config.devServer = {
      port: '8080'
    }

    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require("./package.json").version)
      })
    ]

  },
}