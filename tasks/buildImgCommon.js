'use strict';

const config = global.config,
      functions = require('../config/functions'),
      gulp = require('gulp');

module.exports = function () {
    return config.slides.reduce(function(prev, currentSlide){
        if(currentSlide.isFile) return false;
		return gulp.src( config.tempDir + 'img/**/*' )
			.pipe(gulp.dest( config.readyBDir + functions.getCurNameSlide(currentSlide.num) + '/img'));   
    },0);
};
