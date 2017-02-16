const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const path = require('path');
const currentPath = process.env.INIT_CWD;
const fs = require('fs');
const merge = require('merge-stream');

module.exports = function() {
  var slides, buildPath;

  if (config.settings) {
    slides = fs.readdirSync(config.readyBDir);
    buildPath = config.readyBDir;
    buildPathName = path.parse(config.readyBDir).name;
  } else {
    slides = fs.readdirSync(currentPath);
    buildPath = currentPath;
    buildPathName = path.parse(currentPath).name
  }

  var streams = [];
  slides.forEach(function(currentSlide) {
    let html = path.join(buildPath, currentSlide, currentSlide + '.html');

    if (!fs.existsSync(html)) {
      gutil.log('Find file: ' + currentSlide);
      var stream1 = gulp.src('./config/preview.jpg')
        .pipe(rename(currentSlide + '/' + currentSlide + '-full.jpg'))
        .pipe(gulp.dest(buildPath));
      var stream2 = gulp.src('./config/preview.jpg')
        .pipe(rename(currentSlide + '/' + currentSlide + '-thumb.jpg'))
        .pipe(gulp.dest(buildPath));
      streams.push(stream1, stream2);
    }
  });

  gutil.log(gutil.colors.magenta('Thumbs created for files in ' + buildPathName));
  return merge(streams);
};
