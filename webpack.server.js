const path = require('path')
const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')
const config = require('./webpack.base.js')
/**
 * 服务器端配置：
 * 一、 我们需要webpack能够识别出核心模块，不必把模块的代码合并到最终生成的代码中，只需加入：target: 'node'。
 * 二、如果加载第三方模块，也是不需要打包到最终的代码中的，因为node环境下通过npm已经安装了这些包，会直接引用，
 * 我们通过nodeExternals这个插件解决这个问题。
 *
 * 三、CSS
 * 服务器端打包时我们用了 isomorphic-style-loader，它处理 CSS 的时候，只在对应的 DOM 元素上生成 class 类名，然后返回生成的 CSS 样式代码。
 * 客户端代码打包配置中，我们使用了 css-loader 和 style-loader，css-loader 不但会在 DOM 上生成 class 类名，解析好的 CSS 代码，
 * 还会通过 style-loader 把代码挂载到页面上。
 *
 * 不过这么做，由于页面上的样式实际上最终是由客户端渲染时添加上的，所以页面可能会存在一开始没有样式的情况，为了解决这个问题，
 * 我们可以在服务器端渲染时，拿到 isomorphic-style-loader 返回的样式代码，然后以字符串的形式添加到服务器端渲染的 HTML 之中。
 */
const serverConfig = {
  target: 'node',
  mode: 'development',
  entry: './src/server/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.css?$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpeg|jpg|gif|svg)?$/,
        loader: 'url-loader',
        options: {
          limit: 8000,
          outputPath: '../public/',
          publicPath: '/'
        }
      }
    ]
  }
}

module.exports = merge(config, serverConfig)
