'use strict';

const config = global.config,
      gulp = require('gulp'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + 'app.js' )
        .pipe(newer( config.tempDir + 'app.js' ))
        .pipe(gulp.dest( config.tempDir ));    
};
