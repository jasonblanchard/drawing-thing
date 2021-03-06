const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function relativePath(_path) {
  return path.join(__dirname, _path);
}

module.exports = {
  entry: './src/index.js',
  output: {
    path: relativePath('build'),
    filename: 'app.js'
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: './build'
  },
  resolve: {
    modules: [relativePath('src'), 'node_modules'],
    alias: {
      src: relativePath('src')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        include: relativePath('src'),
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        include: relativePath('src'),
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|scss)$/,
        include: relativePath('src'),
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              localIdentName: '[name]-[local]--[hash:base64:5]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App',
      filename: 'index.html',
      template: relativePath('src/index.html')
    })
  ]
}
