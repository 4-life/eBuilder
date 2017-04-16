const config = global.config,
  gutil = require('gulp-util'),
  Pageres = require('pageres'),
  path = require('path'),
  currentPath = process.env.INIT_CWD,
  fs = require('fs');

module.exports = function() {
  var slides, buildPath, buildPathName;
  var s = 0;

  if(config.settings) {
    slides = fs.readdirSync(config.readyBDir);
    buildPath = config.readyBDir;
    buildPathName = path.parse(config.readyBDir).name;
  }else {
    slides = fs.readdirSync(currentPath);
    buildPath = currentPath;
    buildPathName = path.parse(currentPath).name;
  }

  gutil.log('Find slides directories: ' + slides);

  function task() {
    let pageres = new Pageres({delay: 2});

    let html = path.join(buildPath, slides[s], slides[s] + '.html');

    gutil.log(gutil.colors.bgGreen(slides[s]) + ': ' + (s+1) + '/' + slides.length + ' thumb done' + gutil.colors.green(' ✔ '));

    if (fs.existsSync(html)) {
      pageres.src(html, ['1024x768'], {
        delay: 0,
        filename: slides[s],
        format: 'jpg'
      });
    }

    pageres.dest(path.join('_screenshots', buildPathName)).run().then(() => {
      s++;
      if(s < slides.length) {
        setTimeout(function () {
          task();
        });
      }else {
        gutil.log('Screenshots created');
      }
    });
  }

  task();
};
