'use strict';

const config = global.config,
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      functions = require('../config/functions'),
      file = require('gulp-file');

module.exports = function () {
    let maskSlide = 'Slide: [currentSlide]; [display order: [order]] [external ID: [external]] \r\n',
        maskPres = 'Present: [currentPresen];\r\n groups: [Groups]\r\n detail group: [detailGroup] \r\n \r\n',
        str = '';
    
	str = maskPres
        .replace('[currentPresen]', functions.getCurNamePresentation(''))
        .replace('[Groups]', functions.getGroups(config.presentation.brand)||'')
        .replace('[detailGroup]', functions.getDetailGroup(config.presentation.brand)||'');
    
    
    config.slides.map(function(currentSlide, index){
        str += maskSlide
            .replace('[currentSlide]', functions.getCurNameSlide(currentSlide.num))
            .replace('[order]', index+1)
            .replace('[external]', functions.getCurNamePresentation('') + '__' + functions.getCurNameSlide(currentSlide.num))
    },0);
    
    gulp.src(config.tempDir)
        .pipe(file('slides_list.txt', str));
    
    gutil.log(gutil.colors.magenta('slides list file create in ' + config.tempDir + 'slides_list.txt'));
    gutil.log(gutil.colors.magenta('Preparing end ') + gutil.colors.green('successfully!'))
};
