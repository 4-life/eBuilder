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

  let pageres = new Pageres();

  slides.forEach(function(currentSlide) {
    let html = path.join(buildPath, currentSlide, currentSlide + '.html');

    if (fs.existsSync(html)) {
      pageres.src(html, ['1024x768'], {
        delay: 0,
        filename: currentSlide,
        format: 'jpg'
      });
    }
  });

  return pageres.dest(path.join('_screenshots', buildPathName)).run().then(() => gutil.log('Screenshots created'));
};
