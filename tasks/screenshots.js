const config = global.config,
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  Pageres = require('pageres'),
  rename = require('gulp-rename'),
  path = require('path'),
  currentPath = process.env.INIT_CWD,
  fs = require('fs');

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
    let html = path.join(buildPath, currentSlide, currentSlide + '.html');
    fs.stat(html, function(err, stat) {
      if (err == null) {
        let pageres = new Pageres({
            delay: 0,
            filename: currentSlide,
            format: 'jpg'
          })
          .src(html, ['1024x768'])
          .dest(path.join('_build', '_screenshots', buildPathName))
          .run()
          .then(() => gutil.log('Screenshot ' + currentSlide + ' created'));
      } else {
        gulp.src('../config/preview.jpg')
          .pipe(rename(buildPath + '/' + currentSlide + '.jpg'))
          .pipe(gulp.dest('./_build/_screenshots/'));
          gutil.log('Screenshot ' + currentSlide + ' created');
      }
    });
  }, 0);
};
