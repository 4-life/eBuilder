const config = global.config;
const gulp = require('gulp');
const imagemin = require('gulp-image');
const newer = require('gulp-newer');

module.exports = function() {
  return gulp.src(config.sourceDir + 'img/**/*.{png,jpeg,jpg}')
    .pipe(newer(config.tempDir + 'img'))
    .pipe(imagemin())
    .pipe(gulp.dest(config.tempDir + 'img'));
};
