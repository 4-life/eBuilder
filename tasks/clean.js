const config = global.config,
  gulp = require('gulp'),
  clean = require('gulp-clean');

module.exports = function() {
  return gulp.src(config.readyBDir, {
      read: false
    })
    .pipe(clean())
    .pipe(gulp.src(config.tempDir, {
      read: false
    }))
    .pipe(clean());
};
