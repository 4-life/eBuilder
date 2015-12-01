'use strict';

const config = global.config,
      gulp = require('gulp'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + '_images/**/*' )
        .pipe(newer( config.tempDir ))
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest( config.tempDir ));
};
