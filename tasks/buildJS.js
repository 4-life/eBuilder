'use strict';

const config = global.config,
      gulp = require('gulp'),
      preprocess = require('gulp-preprocess'),
      functions = require('../config/functions'),
      rename = require('gulp-rename');

module.exports = function () {
    return config.slides.reduce(function( curName, currentSlide ){
        if(currentSlide.isFile) return false;
        currentSlide.copy ? curName = currentSlide.copy : curName = currentSlide.num;
        return gulp.src( config.tempDir + 'app.js')
            .pipe(preprocess({
                context: {
                    NUM: curName,
                    ID: currentSlide.num,
                    MAP: config.MAP, 
                    LINKS: config.LINKS
                }
            }))
            .pipe(gulp.dest( config.readyBDir + functions.getCurNameSlide( currentSlide.num ) ));
        },0);     
};
