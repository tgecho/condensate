/* global require, module */

var _ = require('lodash');

module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['mocha', 'chai', 'chai-as-promised'],

    files: [
        'node_modules/babel-core/browser-polyfill.js',
        'tests/*_test.js',
        'tests/**/*_test.js'
    ],

    preprocessors: {
        'tests/*_test.js': ['webpack', 'sourcemap'],
        'tests/**/*_test.js': ['webpack', 'sourcemap']
    },

    webpack: _.defaults({
        devtool: 'inline-source-map'
    }, require("./webpack.config.js")),

    client: {
      mocha: {
        ui: 'tdd'
      }
    },

    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['dots'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    // Chrome, ChromeCanary, Firefox, Opera, Safari (only Mac), PhantomJS, IE (only Windows)
    browsers: ['Firefox'],

    singleRun: false
  });
};
