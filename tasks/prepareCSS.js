'use strict';

const config = global.config,
      gulp = require('gulp'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + 'css/**/*.css' )
        .pipe(newer( config.tempDir + 'css/**/*.css' ))
        .pipe(gulp.dest( config.tempDir + '/css' ));
};
