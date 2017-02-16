const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const Pageres = require('pageres');
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

  gutil.log('Find slides directories: ' + slides);

  let pageres = new Pageres();

  slides.forEach(function(currentSlide) {
    let html = path.join(buildPath, currentSlide, currentSlide + '.html');

    if (fs.existsSync(html)) {
      pageres.src(html, ['1024x768'], {
        delay: 0,
        filename: currentSlide + '/' + currentSlide + '-full',
        format: 'jpg',
        scale: 0.7
      });
    }
  });

  return pageres.dest(buildPath).run().then(() => gutil.log('Full thumbs created'));
};
