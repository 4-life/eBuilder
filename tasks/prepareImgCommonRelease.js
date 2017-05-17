const config = global.config;
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const pngquant = require('imagemin-pngquant');

module.exports = function() {
  return gulp.src(config.sourceDir + 'img/**/*.{png,jpeg,jpg}')
    .pipe(newer(config.tempDir + 'img'))
    .pipe(imagemin([
        imagemin.jpegtran({progressive: true, arithmetic: true}),
        pngquant({quality:60}),
      ],{
      verbose: true,
      progressive: true,
      interlaced: true,
    }))
    .pipe(gulp.dest(config.tempDir + 'img'));
};
