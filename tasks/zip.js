const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const path = require('path');
const currentPath = process.env.INIT_CWD;
const fs = require('fs');
const merge = require('merge-stream');

module.exports = function() {
  var slides, buildPath;

  if(config.settings) {
    slides = fs.readdirSync(config.readyBDir);
    buildPath = config.readyBDir;
    buildPathName = path.parse(config.readyBDir).name;
  }else {
    slides = fs.readdirSync(currentPath);
    buildPath = currentPath;
    buildPathName = path.parse(currentPath).name
  }

  gutil.log('Find slides directories: ' + slides);

  var streams = [];
  slides.forEach(function(currentSlide) {
    let slide = path.join(buildPath, currentSlide, '/**/*');

    var stream = gulp.src(slide, {base: buildPath})
      .pipe(zip(currentSlide + '.zip'))
      .pipe(gulp.dest('./_zip/' + buildPathName));
    streams.push(stream);
  });
  gutil.log(gutil.colors.magenta('zip files create in _zip/' + buildPathName));
  return merge(streams);
};
