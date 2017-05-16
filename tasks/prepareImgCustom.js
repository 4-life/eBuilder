const config = global.config;
const gulp = require('gulp');

module.exports = function() {
  return gulp.src(config.sourceDir + '_images/**/*.{png,jpeg,jpg}')
    .pipe(gulp.dest(config.tempDir));
};
