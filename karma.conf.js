/* global require, module */

var _ = require('lodash');

module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['mocha', 'chai', 'chai-as-promised'],

    files: [
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
    browsers: [
        // 'PhantomJS',
        'Chrome', 'Firefox'
        // 'ChromeCanary', 'Opera', 'Safari'
    ],
    captureTimeout: 1000 * 60,
    // browserNoActivityTimeout: 1000 * 60 * 2.5,

    singleRun: false
  });
};
