const config = global.config,
  gulp = require('gulp'),
  functions = require('../config/functions'),
  preprocess = require('gulp-preprocess');

module.exports = function() {
  return config.slides.reduce(function(curName, currentSlide) {

    if (currentSlide.isFile) return false;
    currentSlide.copy ? curName = currentSlide.copy : curName = currentSlide.num;
    return gulp.src(config.tempDir + 'css/**/*')
      .pipe(preprocess({
        context: {
          NUM: curName,
          ID: currentSlide.num
        }
      }))
      .pipe(gulp.dest(config.readyBDir + functions.getCurNameSlide(currentSlide.num) + '/css/'));
  }, 0);
};
