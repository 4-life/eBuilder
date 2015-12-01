'use strict';

const config = global.config,
      functions = require('../config/functions'),
      gulp = require('gulp');

module.exports = function () {
    return config.slides.reduce(function( curName, currentSlide ){
        currentSlide.copy ? curName = currentSlide.copy : curName = currentSlide.num;
        return gulp.src( config.tempDir + '/' + curName + '/**/*' )
            .pipe(gulp.dest( config.readyBDir + functions.getCurNameSlide( currentSlide.num ) + '/img/' ));
    },0);   
};
