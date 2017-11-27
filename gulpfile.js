const gulp = require('gulp');
const gutil = require('gulp-util');
const runSequence = require('run-sequence').use(gulp);
const watch = require('gulp-watch');
const batch = require('gulp-batch');

try {
  const config = global.config = require(process.env.INIT_CWD + '/config');
} catch (error) {
  const config = global.config = {};
  gutil.log('Config file doesnt exist');
}

const functions = require('./config/functions');

process.setMaxListeners(0);

gulp.task('prepare', () => {

  let prepare = new Promise((resolve, reject) => {

    functions.createEmptyImgFolders();

    if(gutil.env.clean){
      gutil.log(gutil.colors.magenta('Start preparing with clean ' + gutil.colors.blue(config.presentation.brand + '_' + config.presentation.nl_PID) + ' presentation'));
      runSequence('clean', 'prepareImgCommon', 'buildImgCommon', 'prepareImgCustom', 'buildImgCustom', 'prepareCSS', 'buildCSS', 'prepareHTML', 'buildHTML', 'prepareJS', 'buildJS', 'prepareLibJS', 'buildLibJS', 'prepareAssets', 'buildAssets', 'slidesList', function(){resolve();});
    }else{
      gutil.log(gutil.colors.magenta('Start preparing ' + gutil.colors.blue(config.presentation.brand + '_' + config.presentation.nl_PID) + ' presentation'));
      runSequence('prepareImgCommon', 'buildImgCommon', 'prepareImgCustom', 'buildImgCustom', 'prepareCSS', 'buildCSS', 'prepareHTML', 'buildHTML', 'prepareJS', 'buildJS', 'prepareLibJS', 'buildLibJS', 'prepareAssets', 'buildAssets', 'slidesList', function(){resolve();});
    }

  }).then(
    prepare => {
      runSequence('setWatchers');
    },
    error => {
      gutil.log('Rejected: ' + gutil.colors.red(error));
    }
  );

});

gulp.task('setWatchers', () => {

  watch(config.sourceDir + 'img/**/*.{png,jpeg,jpg}', batch(function (events, done) {
    runSequence('prepareImgCommon', 'buildImgCommon', done);
  }));

  watch(config.sourceDir + '_images/**/*.{png,jpeg,jpg}', batch(function (events, done) {
    runSequence('prepareImgCustom', 'buildImgCustom', done);
  }));

  watch(config.sourceDir + 'css/**/*', batch(function (events, done) {
    runSequence('prepareCSS', 'buildCSS', done);
  }));

  watch([config.sourceDir + '*.jade', config.sourceDir + '*.html'], batch(function (events, done) {
    runSequence('prepareHTML', 'buildHTML', done);
  }));

  watch(config.sourceDir + 'app.js', batch(function (events, done) {
    runSequence('prepareJS', 'buildJS', done);
  }));

  watch(config.sourceDir + 'js/**/*', batch(function (events, done) {
    runSequence('prepareLibJS', 'buildLibJS', done);
  }));

  watch(config.sourceDir + 'assets/**/*', batch(function (events, done) {
    runSequence('prepareAssets', 'buildAssets', done);
  }));

  watch(config.sourceDir + 'config.js', batch(function () {
    runSequence('prepare');
  }));

  gutil.log(gutil.colors.blue('watchers on work!'));
});

gulp.task('thumbs', () => {
  return runSequence('pfull', function() {return false;});
});

gulp.task('build', () => {
  gutil.log(gutil.colors.magenta('Start build ' + gutil.colors.blue(config.presentation.brand + '_' + config.presentation.nl_PID) + ' presentation'));
  runSequence('prepareImgCommon', 'buildImgCommon', 'prepareImgCustom', 'buildImgCustom', 'prepareCSS', 'buildCSS', 'prepareHTML', 'buildHTML', 'prepareJS', 'buildJS', 'prepareLibJS', 'buildLibJS', 'prepareAssets', 'buildAssets', 'slidesList');
});

gulp.task('upload', () => {
  return runSequence('zip', 'ctl', 'ftpzip', 'ftpctl', function() {gutil.log('Task upload is done');});
});

gulp.task('prepareImgCommon', require('./tasks/prepareImgCommon'));
gulp.task('buildImgCommon',   require('./tasks/buildImgCommon'));
gulp.task('prepareImgCustom', require('./tasks/prepareImgCustom'));
gulp.task('buildImgCustom',   require('./tasks/buildImgCustom'));
gulp.task('prepareCSS',       require('./tasks/prepareCSS'));
gulp.task('buildCSS',         require('./tasks/buildCSS'));
gulp.task('prepareHTML',      require('./tasks/prepareHTML'));
gulp.task('buildHTML',        require('./tasks/buildHTML'));
gulp.task('prepareJS',        require('./tasks/prepareJS'));
gulp.task('buildJS',          require('./tasks/buildJS'));
gulp.task('prepareLibJS',     require('./tasks/prepareLibJS'));
gulp.task('buildLibJS',       require('./tasks/buildLibJS'));
gulp.task('prepareAssets',    require('./tasks/prepareAssets'));
gulp.task('buildAssets',      require('./tasks/buildAssets'));
gulp.task('pfull',            require('./tasks/fullPreview'));
gulp.task('pthumb',           require('./tasks/thumbPreview'));
gulp.task('thumbsforfiles',   require('./tasks/thumbsforfiles'));
gulp.task('screenshots',      require('./tasks/screenshots'));
gulp.task('slidesList',       require('./tasks/slidesList'));
gulp.task('zip',              require('./tasks/zip'));
gulp.task('ctl',              require('./tasks/ctl'));
gulp.task('ftpzip',           require('./tasks/ftpzip'));
gulp.task('ftpctl',           require('./tasks/ftpctl'));
gulp.task('clean',            require('./tasks/clean'));
gulp.task('createpresent',    require('./tasks/createPresent'));
gulp.task('excel',            require('./tasks/descriptionToExcel'));
gulp.task('imagemin',         require('./tasks/imagemin'));
gulp.task('help',             require('./tasks/help'));

gulp.task('default', ['prepare']);
