const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 需要安装这个插件

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/videos/[name][ext]'
        }
      }
    ]
  },
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'public'),
      },
      {
        directory: path.join(__dirname, 'src/assets'),
        publicPath: '/assets'
      }
    ],
    compress: true,
    port: 3000,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // 模板文件路径
      filename: 'index.html',       // 输出文件名
      inject: 'body',               // 将脚本注入到 body 底部
    }),
    new HtmlWebpackPlugin({
      template: './assessment.html', // 模板文件路径
      filename: 'assessment.html',       // 输出文件名
      inject: 'body',               // 将脚本注入到 body 底部
    }),
    // 添加复制插件，将数据文件复制到构建目录
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/data', to: 'src/data' }
      ]
    })
  ],
};