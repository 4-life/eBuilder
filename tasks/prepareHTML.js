const config = global.config,
  gulp = require('gulp');

module.exports = function() {
  return gulp.src(config.sourceDir + 'index.html')
    .pipe(gulp.dest(config.tempDir));
};
