const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'floating.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  devServer: {
    proxy: {
      '/loating': {
        target: 'http://h5game.api.crotnet.com/',
        pathRewrite: { '^/loating': '' },
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false // 设置支持https协议的代理
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'demo',
      template: './src/index.html'
    }),
    new HtmlWebpackPlugin({
      title: '跳转',
      template: './src/demo.html',
      filename: 'demo.html',
      chunks: []
    })
  ]
};
