const config = global.config,
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  newer = require('gulp-newer');

module.exports = function() {
  return gulp.src(config.sourceDir + '_images/**/*.{png,jpeg,jpg}')
    .pipe(newer(config.tempDir))
    .pipe(imagemin([
        pngquant({quality:60}),
      ],{
      verbose: true,
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest(config.tempDir));
};
