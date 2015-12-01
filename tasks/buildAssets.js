'use strict';

const config = global.config,
      functions = require('../config/functions'),
      gulp = require('gulp');

module.exports = function () {
    return config.slides.reduce(function(prev, currentSlide){
        if(currentSlide.isFile) return false;  
        if(typeof(currentSlide.assets) != "undefined"){
            for(var v in currentSlide.assets){
                gulp.src( config.tempDir + 'assets/' + currentSlide.assets[v] )
                    .pipe(gulp.dest( config.readyBDir + functions.getCurNameSlide( currentSlide.num ) + '/assets/' ));
            }
        }
    },0);    
};
