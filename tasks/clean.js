'use strict';

const config = global.config,
      gulp = require('gulp'),
      clean = require('gulp-clean');

module.exports = function () {
    return gulp.src(config.dest, {read: false})
        .pipe(clean());   
};
