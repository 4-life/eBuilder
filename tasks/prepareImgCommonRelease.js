const config = global.config;
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

module.exports = function() {
  return gulp.src(config.sourceDir + 'img/**/*.{png,jpeg,jpg}')
    .pipe(newer(config.tempDir + 'img'))
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true, arithmetic: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest(config.tempDir + 'img'));
};
