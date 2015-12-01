'use strict';

const config = global.config,
      gulp = require('gulp'),
      newer = require('gulp-newer'),
      rename = require('gulp-rename');

module.exports = function () {
    return gulp.src( config.sourceDir + 'js/**/*' )
        .pipe(newer( config.tempDir + 'js' ))
        .pipe(gulp.dest( config.tempDir + 'js' ));    
};
