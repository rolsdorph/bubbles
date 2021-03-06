const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  dotenv.config({ path: envPath(env) });

  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'out'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'src')
          ],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react'
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        DEBUG_MODE: JSON.stringify(process.env['DEBUG_MODE'] === 'true'),
        WS_URL: JSON.stringify(process.env['WS_URL']),
        WS_PROTOCOL: JSON.stringify(process.env['WS_PROTOCOL']),
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'index.html' }
        ]
      })
    ]
  }
};

function envPath(env) {
  return path.resolve(__dirname, (env.production) ? '.env.production' : '.env');
}