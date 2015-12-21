'use strict';

const config = global.config,
      gulp = require('gulp'),
      jade = require('gulp-jade');

module.exports = function () {
    return gulp.src( config.sourceDir + 'index.jade' )
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest( config.tempDir ));
};
