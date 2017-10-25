const path = require('path'),
  mkdirp = require('mkdirp'),
  fs = require('fs');

var functions = {

  getCurNameSlide: function(n) {
    var p = global.config.presentation;
    var bms = global.config.bms;

    if (bms) {
      return p.presentPrefix + "_" + bms.shortbrand + "_" + bms.audience + p.nl_PID + "_" + bms.materialType + "_" + p.slidePrefix + n + "__" + p.lang;
    }

    return p.slidePrefix + n + "_" + p.nl_PID + "_" + p.brand + "_" + p.lang;
  },

  getCurNamePresentation: function(n) {
    var p = global.config.presentation;
    var bms = global.config.bms;

    if (!n) n = Object.keys(global.config.settings.map)[0];

    if (bms) {
      return p.presentPrefix + "_" + p.brand + "_" + bms.audience + p.nl_PID + "_" + bms.materialType + "_" + bms.purpose + "_" + p.lang;
    }

    return p.presentPrefix + n + "_" + p.nl_PID + "_" + p.brand + "_" + p.lang;
  },

  getCustomIdPresentation: function(id) {
    const customId = global.config.presentation.customPresentationId;
    if (id && Object.keys(global.config.settings.map)[0] === id && customId) {
      return customId;
    } else {
      return this.getCurNamePresentation(id);
    }
  },

  getCurPresentation: function(s) {
    for (var i in global.config.settings.map) {
      var obj = global.config.settings.map[i].slides;
      if (obj.indexOf(s) >= 0) {
        return functions.getCustomIdPresentation(i);
      }
    }
  },

  setPresentSettings: function() {
    var obj = {};
    var p = global.config.settings;

    if (!p) return '';

    for (var e in p.map) {
      if (Object.keys(p.map)[0] === e) {
        obj[this.getCustomIdPresentation(e)] = functions.getObjData(p.map[e]);
      } else {
        obj[functions.getCurNamePresentation(e)] = functions.getObjData(p.map[e]);
      }
    }
    return obj;
  },

  setPresentLinks: function() {
    var newLinks = [],
      p = global.config.settings,
      s = global.config.slides;

    if (!p) return '';

    for (var e in p.links) {
      newLinks.push({
        class: p.links[e].class,
        slideTo: functions.getCurNameSlide(p.links[e].slideTo),
        presentTo: functions.getCustomIdPresentation(p.links[e].presentTo)
      });
    }
    for (var e in s) {
      newLinks.push({
        class: '_goto_' + s[e].num,
        slideTo: functions.getCurNameSlide(s[e].num),
        presentTo: functions.getCurPresentation(s[e].num)
      });
    }
    return newLinks;
  },

  getObjData: function(obj) {
    var newObj = {};

    newObj["slides"] = obj.slides.reduce(function(p, c) {
      p.push(functions.getCurNameSlide(c));
      return p;
    }, []);
    newObj["p_slide"] = obj.p_slide ? functions.getCurNameSlide(obj.p_slide) : "";
    newObj["p_pres"] = obj.p_pres ? functions.getCustomIdPresentation(obj.p_pres) : "";
    return newObj;
  },

  getDetailGroup: function(brand) {
    brand = brand.toLowerCase();
    for (var e in functions.referenceData) {
      if (functions.referenceData[e].brand == brand) {
        return functions.referenceData[e].detailGroup;
      }
    }
  },

  getGroups: function(brand) {
    brand = brand.toLowerCase();
    for (var e in functions.referenceData) {
      if (functions.referenceData[e].brand == brand) {
        return functions.referenceData[e].groups;
      }
    }
  },

  referenceData: [],

  createEmptyImgFolders: function() {

    let assetsPath = path.join(global.config.sourceDir, '_assets');
    fs.exists(assetsPath, function(exists) {
      if (!exists) {
        mkdirp(assetsPath, function(err) {
          if (err) console.error(err);
          else console.log('Creating empty assets dir in ' + assetsPath);
        });
      }
    });

    let filesPath = path.join(global.config.sourceDir, '_files');
    fs.exists(filesPath, function(exists) {
      if (!exists) {
        mkdirp(filesPath, function(err) {
          if (err) console.error(err);
          else console.log('Creating empty files dir in ' + filesPath);
        });
      }
    });

    config.slides.map(function(currentSlide) {
      if (currentSlide.isFile || currentSlide.copy) return false;
      let sourcePath = path.join(global.config.sourceDir, '_images', currentSlide.num + '');
      fs.exists(sourcePath, function(exists) {
        if (!exists) {
          mkdirp(sourcePath, function(err) {
            if (err) console.error(err);
            else console.log('Creating empty images dir in ' + sourcePath);
          });
        }
      });
    });
  },

  projectRoot: process.cwd()
};

global.config.MAP = "map:" + JSON.stringify(functions.setPresentSettings()) + ",";
global.config.LINKS = "links:" + JSON.stringify(functions.setPresentLinks()) + ",";
global.config.readyBDir = path.join('_build', functions.getCurNamePresentation(), '/');
global.config.tempDir = path.join('.tmp', "._temp_" + functions.getCurNamePresentation(), '/');
global.config.sourceDir = path.join(global.config.sourceDir || '.tmp', '/');

module.exports = functions;
