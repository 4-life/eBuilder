const config = global.config,
  gulp = require('gulp'),
  less = require('gulp-less');

module.exports = function() {
  return gulp.src(config.sourceDir + 'css/styles.less')
    .pipe(less())
    .pipe(gulp.dest(config.tempDir + '/css'));
};
