/* global require, module, __dirname */

var path = require('path');

module.exports = {
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /react\/|immutable/, loader: 'babel' },
        ]
    },
    devtool: 'sourcemap',
    resolve: {
        alias: {
            condensate: path.join(__dirname, 'src')
        }
    }
};
