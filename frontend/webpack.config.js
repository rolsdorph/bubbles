const path = require('path');

module.exports = {
  entry: './out/main.js', // later: change this to src/main.js
  output: {
    path: path.resolve(__dirname, 'out'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};