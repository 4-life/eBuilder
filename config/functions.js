'use strict';

let path = require('path'),
    mkdirp = require('mkdirp'),
    fs = require('fs');

var functions = {
    
    getCurNameSlide: function(n){
        var p = global.config.presentation;
        return p.slidePrefix + n + "_" + p.nl_PID + "_" + p.brand + "_" + p.lang;  
    },
    
    getCurNamePresentation: function(n){
        var p = global.config.presentation;
        return p.presentPrefix + n + "_" + p.nl_PID + "_" + p.brand + "_" + p.lang;  
    },
    
    getCurPresentation: function(s){
        for(var i in global.config.template.settings.map){
            var obj = global.config.template.settings.map[i].slides;
            if(obj.indexOf(s) >= 0){
                return functions.getCurNamePresentation(i);
            }
        }	
    },
    
    setPresentSettings: function(){
        var obj = {};
        var p = global.config.template.settings;

        for (var e in p.map) {
            obj[ functions.getCurNamePresentation(e) ] = functions.getObjData(p.map[e]);
        }
        return obj;
    },
    
    setPresentLinks: function(){
        var newLinks = [],
            p = global.config.template.settings,
            s = global.config.slides;

        for (var e in p.links) {
            newLinks.push({ 
                class: p.links[e].class, 
                slideTo: functions.getCurNameSlide(p.links[e].slideTo), 
                presentTo: functions.getCurNamePresentation(p.links[e].presentTo) 
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
    
    getObjData: function(obj){
        var newObj = {};    

        newObj["slides"] = obj.slides.reduce(function(p,c){
            p.push(functions.getCurNameSlide(c)); return p;
        },[]);
        newObj["p_slide"] = obj.p_slide ? functions.getCurNameSlide(obj.p_slide) : "";
        newObj["p_pres"] = obj.p_pres ? functions.getCurNamePresentation(obj.p_pres) : "";
        return newObj;
    },
    
    getDetailGroup: function(brand){
        brand = brand.toLowerCase();
        for (var e in functions.referenceData) {
            if(functions.referenceData[e].brand == brand){
                return functions.referenceData[e].detailGroup;
                break;
            }
        }
    },
    
    getGroups: function(brand){
        brand = brand.toLowerCase();
        for (var e in functions.referenceData) {
            if(functions.referenceData[e].brand == brand){
                return functions.referenceData[e].groups;
                break;
            }
        }
    },
    
	referenceData: [
		{brand: 'byetta',     groups: '[RU_KOB],[RU_Brand_Team]',     detailGroup: 'Diabet_RU'},
		{brand: 'komboglyze', groups: '[RU_KOB],[RU_Brand_Team]',     detailGroup: 'Diabet_RU'},
		{brand: 'onglyza',    groups: '[RU_KOB],[RU_Brand_Team]',     detailGroup: 'Diabet_RU'},
		{brand: 'forxiga',    groups: '[RU_FORXIGA],[RU_Brand_Team]', detailGroup: 'Diabet_RU'},
		{brand: 'pulmicort',  groups: '[RU_RIA],[RU_Brand_Team]',     detailGroup: 'RIA_RU'},
		{brand: 'symbicort',  groups: '[RU_RIA],[RU_Brand_Team]',     detailGroup: 'RIA_RU'},
		{brand: 'iressa',     groups: '[RU_ONCO],[RU_Brand_Team]',    detailGroup: 'Onco_RU'},
		{brand: 'zoladex',    groups: '[RU_ONCO],[RU_Brand_Team]',    detailGroup: 'Onco_RU'},
		{brand: 'faslodex',   groups: '[RU_ONCO],[RU_Brand_Team]',    detailGroup: 'Onco_RU'},
		{brand: 'zinforo',    groups: '[RU_HOSPITAL],[RU_HOSPITAL_CNS],[RU_Brand_Team]', detailGroup: 'Infection_RU'},
		{brand: 'seroquel',   groups: '[RU_CNS],[RU_HOSPITAL_CNS],[RU_Brand_Team]',      detailGroup: 'CNS_RU'},
		{brand: 'nexium',     groups: '[RU_GI_PHARMACY],[RU_GI],[RU_Brand_Team]',        detailGroup: 'GI_RU'},
		{brand: 'infonova',   groups: '[RU_CV_STA],[RU_GPD_STA],[RU_PHARMACY_KAS],[RU_Brand_Team]', detailGroup: 'RIA_RU'}
	],
    
    createEmptyImgFolders: function(){
        
        let assetsPath = path.join(global.config.sourceDir, '_assets');
        fs.exists(assetsPath, function(exists) {
            if (!exists) {
                mkdirp(assetsPath, function (err) {
                    if (err) console.error(err)
                    else console.log('Creating empty assets dir in ' + assetsPath);
                });
            }
        });
        
        let filesPath = path.join(global.config.sourceDir, '_files');
        fs.exists(filesPath, function(exists) {
            if (!exists) {
                mkdirp(filesPath, function (err) {
                    if (err) console.error(err)
                    else console.log('Creating empty files dir in ' + filesPath);
                });
            }
        });
        
        config.slides.map(function(currentSlide){
            if(currentSlide.isFile) return false;
            let sourcePath = path.join(global.config.sourceDir, '_images', currentSlide.num+'');
            fs.exists(sourcePath, function(exists) {
                if (!exists) {
                    mkdirp(sourcePath, function (err) {
                        if (err) console.error(err)
                        else console.log('Creating empty images dir in ' + sourcePath);
                    });
                }
            });
        });        
    },
    
    projectRoot: process.cwd()
}


module.exports = functions;