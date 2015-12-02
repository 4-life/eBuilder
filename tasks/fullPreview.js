'use strict';

const config = global.config,
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      Pageres = require('pageres'),
      rename = require('gulp-rename'),
      functions = require('../config/functions'),
      path = require('path'),
      fs = require('fs');

module.exports = function () {
    return config.slides.reduce(function( curName, currentSlide ){
        currentSlide.copy ? curName = currentSlide.copy : curName = currentSlide.num;
        let folderName = functions.getCurNameSlide( currentSlide.num );
        
        if(currentSlide.isFile){
            
            gulp.src('./config/preview.jpg')
                .pipe(rename(folderName+'/'+folderName+'-full.jpg'))
                .pipe(gulp.dest(config.readyBDir));
            gutil.log('Full thumb for file ' + gutil.colors.blue(folderName) + ' created!');
            
        }else{
        
            let html = path.join(config.readyBDir, folderName, folderName + '.html'),
                existImg = path.join(config.readyBDir, folderName, folderName + '-full.jpg');
            
            fs.exists(existImg, function(exists) {
                if (!exists) {
                    let pageres = new Pageres({delay: 0, filename: folderName+'-full', format: 'jpg'})
                        .src(html, ['1024x768'])
                        .dest(path.join(config.readyBDir, folderName))
                        .run()
                        .then(() => gutil.log('Full thumb for ' + gutil.colors.green(folderName) + ' created!'));
                }else{
                    gutil.log('Full thumb for ' + gutil.colors.green(folderName) + ' already existing');
                }
            });
        }
    },0);    
};
