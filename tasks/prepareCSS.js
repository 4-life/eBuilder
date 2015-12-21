'use strict';

const config = global.config,
      gulp = require('gulp'),
      less = require('gulp-less'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + 'css/base.less' )
        .pipe(newer( config.tempDir + 'base.css' ))
        .pipe(less())
        .pipe(gulp.dest( config.tempDir + '/css' ));
};
