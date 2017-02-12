const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const path = require('path');
const currentPath = process.env.INIT_CWD;
const fs = require('fs');

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

  return slides.reduce(function(curName, currentSlide) {
    let slide = path.join(buildPath, currentSlide, '/**/*');

    gulp.src(slide, {base: buildPath})
      .pipe(zip(currentSlide + '.zip'))
      .pipe(gulp.dest('./_build/_zip/' + buildPathName));

  }, 0);
};
