'use strict';

const config = global.config,
      gulp = require('gulp'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + '_assets/**/*' )
        .pipe(newer( config.tempDir + '_assets' ))
        .pipe(gulp.dest( config.tempDir + 'assets' ));    
};
