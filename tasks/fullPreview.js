const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const Pageres = require('pageres');
const path = require('path');
const currentPath = process.env.INIT_CWD;
const fs = require('fs');

module.exports = function() {
  var slides, buildPath, buildPathName;
  var s = 0;

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

  function task() {
    let pageres = new Pageres({delay: 0});

    let html = path.join(buildPath, slides[s], slides[s] + '.html');

    if (fs.existsSync(html)) {
      pageres.src(html, ['1024x768'], {
        delay: 0,
        filename: slides[s] + '/' + slides[s] + '-full',
        format: 'jpg'
      });
      pageres.src(html, ['1024x768'], {
        delay: 0,
        filename: slides[s] + '/' + slides[s] + '-thumb',
        format: 'jpg',
        scale: 0.2
      });
    }

    pageres.dest(buildPath).run().then(() => {
      s++;
      gutil.log(gutil.colors.bgGreen(slides[s-1]) + ': ' + (s) + '/' + slides.length + ' thumb done' + gutil.colors.green(' ✔ '));
      if(s < slides.length) {
        setTimeout(function () {
          task();
        }, 1000);
      } else {
        gutil.log('Thumbs created');
        setTimeout(function() {
          gulp.start('thumbsforfiles');
        }, slides.length * 100);
      }
    });
  }

  task();
};
