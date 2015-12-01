'use strict';

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      runSequence = require('run-sequence').use(gulp),
      mkdirp = require('mkdirp'),
      fs = require('fs'),
      watch = require('gulp-watch'),
      batch = require('gulp-batch'),
      path = require('path'),
      functions = require('./config/functions'),
      config = require('./config/default');

global.config = config;


gulp.task('prepare', function () {
    
    gutil.log(gutil.colors.cyan('Start preparing...'));
    
    global.config.MAP = "map:" + JSON.stringify( functions.setPresentSettings() ) + ",";
    global.config.LINKS = "links:" + JSON.stringify( functions.setPresentLinks() ) + ",";
    global.config.readyBDir = path.join('_build', functions.getCurNamePresentation(""), '/');
    global.config.tempDir = path.join('_build', "_temp_" + functions.getCurNamePresentation(""), '/');
    global.config.sourceDir = path.join('_source', global.config.sourceDir, '/');

    fs.exists(global.config.sourceDir, function(exists) {
        if (!exists) global.config.sourceDir = path.join('_source', 'default', '/');
        
        config.slides.map(function(currentSlide){
            if(currentSlide.isFile) return false;
            let sourcePath = path.join(global.config.sourceDir, '_images', currentSlide.num+'');
            fs.exists(sourcePath, function(exists) {
                if (!exists) {
                    mkdirp(sourcePath, function (err) {
                        if (err) console.error(err)
                        else gutil.log('Creating empty images dir in ' + gutil.colors.blue(sourcePath));
                    });
                }
            });
        });
    });
    

    
    watch(config.sourceDir + 'img/**/*', batch(function (events, done) {
        runSequence('prepareImgCommon', 'buildImgCommon', done);
    }));
    
    watch(config.sourceDir + '_images/**/*', batch(function (events, done) {
        runSequence('prepareImgCustom', 'buildImgCustom', done);
    }));
    
    watch(config.sourceDir + 'css/**/*.css', batch(function (events, done) {
        runSequence('prepareCSS', 'buildCSS', done);
    }));
    
    watch(config.sourceDir + 'index.html', batch(function (events, done) {
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
    
    runSequence('prepareImgCommon', 'buildImgCommon', 'prepareImgCustom', 'buildImgCustom', 'prepareCSS', 'buildCSS', 'prepareHTML', 'buildHTML', 'prepareJS', 'buildJS', 'prepareLibJS', 'buildLibJS', 'prepareAssets', 'buildAssets', 'fullPreview', 'thumbPreview', 'slidesList');
});

gulp.task('prepareImgCommon', require('./tasks/prepareImgCommon'));
gulp.task('buildImgCommon', require('./tasks/buildImgCommon'));
gulp.task('prepareImgCustom', require('./tasks/prepareImgCustom'));
gulp.task('buildImgCustom', require('./tasks/buildImgCustom'));
gulp.task('prepareCSS', require('./tasks/prepareCSS'));
gulp.task('buildCSS', require('./tasks/buildCSS'));
gulp.task('prepareHTML', require('./tasks/prepareHTML'));
gulp.task('buildHTML', require('./tasks/buildHTML'));
gulp.task('prepareJS', require('./tasks/prepareJS'));
gulp.task('buildJS', require('./tasks/buildJS'));
gulp.task('prepareLibJS', require('./tasks/prepareLibJS'));
gulp.task('buildLibJS', require('./tasks/buildLibJS'));
gulp.task('prepareAssets', require('./tasks/prepareAssets'));
gulp.task('buildAssets', require('./tasks/buildAssets'));
gulp.task('fullPreview', require('./tasks/fullPreview'));
gulp.task('thumbPreview', require('./tasks/thumbPreview'));
gulp.task('slidesList', require('./tasks/slidesList'));
gulp.task('clean', require('./tasks/clean'));
gulp.task('clear', require('./tasks/clean'));

gulp.task('default', ['prepare']);