const config = global.config;
const gulp = require('gulp');
const gutil = require('gulp-util');
const file = require('gulp-file');
const ftpData = require('../config/.ftp.json');
const currentPath = process.env.INIT_CWD;
const fs = require('fs');
const path = require('path');

const merge = require('merge-stream');

module.exports = function() {
  let slides, buildPathName;
  let buildPath;
  let maskCTL = 'USER=[username]\r\nPASSWORD=[pass]\r\nFILENAME=[filename]\r\nName=[slidename]\r\nDescription_vod__c=[description]\r\nActive_vod__c=true';
  let str = '';
  let descriptions;

  try {
    descriptions = JSON.parse(fs.readFileSync(currentPath + '/descriptions.json', 'utf8'));
    gutil.log('Find custom descriptions...');
  } catch (err) {
    descriptions = false;
  }

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
    let description = '';
    if (descriptions) {
      description = descriptions[currentSlide] || currentSlide;
    } else {
      description = currentSlide;
    }

    str = maskCTL
      .replace('[username]', ftpData.user)
      .replace('[pass]', ftpData.pass)
      .replace('[filename]', currentSlide + '.zip')
      .replace('[slidename]', currentSlide)
      .replace('[description]', description);

    var stream = gulp.src('./_ctl/')
      .pipe(file(currentSlide + '.ctl', str))
      .pipe(gulp.dest('./_ctl/' + buildPathName));
    streams.push(stream);
  });

  gutil.log(gutil.colors.magenta('ctl files create in _ctl/' + buildPathName));
  return merge(streams);
};
