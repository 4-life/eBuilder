const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const path = require('path');
const currentPath = process.env.INIT_CWD;
const fs = require('fs');
const merge = require('merge-stream');

module.exports = function() {
  var slides, buildPath, buildPathName;

  if (config.settings) {
    slides = fs.readdirSync(config.readyBDir);
    buildPath = config.readyBDir;
    buildPathName = path.parse(config.readyBDir).name;
  } else {
    slides = fs.readdirSync(currentPath);
    buildPath = currentPath;
    buildPathName = path.parse(currentPath).name;
  }

  gutil.log('Find slides directories: ' + slides);

  var streams = [];
  slides.forEach(function(currentSlide) {
    let fullthumb = path.join(buildPath, currentSlide, currentSlide + '-full.jpg');

    if (fs.existsSync(fullthumb)) {
      var stream = gulp.src(fullthumb)
        .pipe(rename(currentSlide + '/' + currentSlide + '-thumb.jpg'))
        .pipe(gulp.dest(buildPath));
      streams.push(stream);
    }
  });

  gutil.log(gutil.colors.magenta('Thumbs created in ' + buildPathName));
  return merge(streams);
};
