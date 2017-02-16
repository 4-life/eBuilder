const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const functions = require('../config/functions');
const file = require('gulp-file');
const ftpData = require('../config/.ftp.json');
const currentPath = process.env.INIT_CWD;
const fs = require('fs');
const ftp = require('vinyl-ftp');
const path = require('path');

module.exports = function() {
  let slides;
  let buildPath;
  let zipfiles = [];
  let ctlfiles = [];

  let connection = ftp.create({
    host: ftpData.host,
    user: ftpData.user,
    password: ftpData.pass,
    parallel: 0,
    log: gutil.log
  });

  if (config.settings) {
    slides = fs.readdirSync(config.readyBDir);
    buildPath = config.readyBDir;
    buildPathName = path.parse(config.readyBDir).name;
  } else {
    slides = fs.readdirSync(currentPath);
    buildPath = currentPath;
    buildPathName = path.parse(currentPath).name;
  }

  slides.map(function(currentSlide) {
    ctlfiles.push('./_ctl/' + buildPathName + '/' + currentSlide + '.ctl');
  }, 0);

  gutil.log(gutil.colors.magenta('Try to transfering ctl files...'));

  return gulp.src(ctlfiles, {
      buffer: false
    })
    .pipe(connection.dest('/ctlfile/'));

};
