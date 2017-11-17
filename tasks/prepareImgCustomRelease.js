const config = global.config;
const gulp = require('gulp');
const imagemin = require('gulp-image');
const newer = require('gulp-newer');

module.exports = function() {
  return gulp.src(config.sourceDir + '_images/**/*.{png,jpeg,jpg}')
    .pipe(newer(config.tempDir))
    .pipe(imagemin())
    .pipe(gulp.dest(config.tempDir));
};
