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

  var streams = [];
  slides.forEach(function(currentSlide) {
    let html = path.join(buildPath, currentSlide, currentSlide + '.html');

    if (!fs.existsSync(html)) {
      fs.readdir(path.join(buildPath, currentSlide), function(err, files) {
        files = files.filter(function(file) { return file.indexOf(currentSlide + '.') === 0; });

        if(files.length === 1) {
          gutil.log('Find file: ' + files[0]);

          let ext = path.extname(files[0]);
          let previewExt = '';

          switch (ext) {
            case '.pdf':
              previewExt = './config/preview-pdf.jpg';
              break;
            case '.mp4':
            case '.m4v':
            case '.avi':
              previewExt = './config/preview-video.jpg';
              break;
            case '.jpeg':
            case '.jpg':
            case '.png':
            case '.gif':
              previewExt = './config/preview-image.jpg';
              break;
            default:
              previewExt = './config/preview.jpg';
          }

          var stream1 = gulp.src(previewExt)
            .pipe(rename(currentSlide + '/' + currentSlide + '-full.jpg'))
            .pipe(gulp.dest(buildPath));
          var stream2 = gulp.src(previewExt)
            .pipe(rename(currentSlide + '/' + currentSlide + '-thumb.jpg'))
            .pipe(gulp.dest(buildPath));
          streams.push(stream1, stream2);
        }
      });
    }
  });

  gutil.log(gutil.colors.magenta('Thumbs created for files in ' + buildPathName));
  return merge(streams);
};
