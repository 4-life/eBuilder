const config = global.config;
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

module.exports = function() {
  return gulp.src(config.sourceDir + '_images/**/*.{png,jpeg,jpg}')
    .pipe(newer(config.tempDir))
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true, arithmetic: true}),
      imagemin.optipng({optimizationLevel: 5})
    ],{
      verbose: true
    }))
    .pipe(gulp.dest(config.tempDir));
};
