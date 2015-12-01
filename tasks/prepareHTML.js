'use strict';

const config = global.config,
      gulp = require('gulp'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + 'index.html' )
        .pipe(newer( config.tempDir + 'index.html' ))
        .pipe(gulp.dest( config.tempDir ));
};
