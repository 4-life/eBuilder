const config = global.config;
const gulp = require('gulp');
const imagemin = require('gulp-image');

module.exports = function() {
  return gulp.src(config.sourceDir + '**/*.{png,jpeg,jpg}')
    .pipe(imagemin())
    .pipe(gulp.dest(config.sourceDir));
};
