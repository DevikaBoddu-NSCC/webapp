const path = require('path');
const nodeExternals = require('webpack-node-externals')
module.exports = {
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()]
};
