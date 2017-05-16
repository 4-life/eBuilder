const config = global.config;
const gulp = require('gulp');

module.exports = function() {
  return gulp.src(config.sourceDir + 'img/**/*.{png,jpeg,jpg}')
    .pipe(gulp.dest(config.tempDir + 'img'));
};
