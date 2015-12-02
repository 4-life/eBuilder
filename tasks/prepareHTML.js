'use strict';

const config = global.config,
      gulp = require('gulp'),
      jade = require('gulp-jade'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + 'index.jade' )
        .pipe(jade())
        .pipe(gulp.dest( config.tempDir ));
};
