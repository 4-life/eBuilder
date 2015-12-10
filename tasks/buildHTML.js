'use strict';

const config = global.config,
      gulp = require('gulp'),
      preprocess = require('gulp-preprocess'),
      functions = require('../config/functions'),
      rename = require('gulp-rename');

module.exports = function () {
    return config.slides.reduce(function( curName, currentSlide ){
        currentSlide.copy ? curName = currentSlide.copy : curName = currentSlide.num;
        let folderName = functions.getCurNameSlide( currentSlide.num );
        if(currentSlide.isFile){
            return gulp.src( config.sourceDir + '_files/' + currentSlide.num + '.*' )
                .pipe(rename( folderName + '/' + folderName + '.pdf' ))
                .pipe(gulp.dest( config.readyBDir ));     
        }else{
            return gulp.src( config.tempDir + 'index.html' )
                .pipe(preprocess({
                    context: {
                        NUM: curName,
                        ID: currentSlide.num
                    }
                }))
                .pipe(rename( folderName + '/' + folderName + '.html' ))
                .pipe(gulp.dest( config.readyBDir )); 
        }
    },0);    
};
