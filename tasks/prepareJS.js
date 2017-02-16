const config = global.config,
  gulp = require('gulp'),
  newer = require('gulp-newer');
const jshint = require('gulp-jshint');

module.exports = function() {
  return gulp.src(config.sourceDir + 'app.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    // .pipe(jshint.reporter('fail'))
    .pipe(newer(config.tempDir + 'app.js'))
    .pipe(gulp.dest(config.tempDir));
};
