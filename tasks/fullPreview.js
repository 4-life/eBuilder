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
        format: 'jpg',
        scale: 0.7
      });
    }

    pageres.dest(buildPath).run().then(() => {
      s++;
      gutil.log('' + (s) + '/' + slides.length + ' thumb done');
      if(s < slides.length) {
        task();
      }else {
        gutil.log('Thumbs created');
        gulp.start('pthumb', 'thumbsforfiles');
      }
    });
  }

  task();
};
