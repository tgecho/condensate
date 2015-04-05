/* global require, module, __dirname */

var path = require('path');

module.exports = {
    entry: {
        'react-router': './react-router/index.jsx'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /react\/|immutable/, loader: 'babel' },
            { test: /\.jsx$/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.scss$/, loader: 'style!css!autoprefixer!sass?outputStyle=nested' },
        ]
    },
    devtool: 'sourcemap',
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            condensate: path.join(__dirname, '../src')
        }
    }
};
