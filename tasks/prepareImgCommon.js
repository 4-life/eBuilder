'use strict';

const config = global.config,
      gulp = require('gulp'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      newer = require('gulp-newer');

module.exports = function () {
    return gulp.src( config.sourceDir + 'img/**/*' )
        .pipe(newer( config.tempDir + 'img' ))
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest( config.tempDir + 'img' ));    
};
