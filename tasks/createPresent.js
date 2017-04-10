const config = global.config;
// const path = require('path');
// const fs = require('fs');
const gutil = require('gulp-util');
const ftpData = require('../config/.ftp.json');
const functions = require('../config/functions');

const jsforce = require('jsforce');

module.exports = function() {
  let slides, name, Clm_Presentation, Product_vod__c, Key_Message, Clm_Presentation_Slide_vod__c, hidden, product, lang, approved, upsertinsert;

  var conn = new jsforce.Connection({
    loginUrl : 'https://test.salesforce.com'
  });
  var username = ftpData.user;
  var password = ftpData.pass + ftpData.token;

  conn.bulk.pollInterval = 5000;
  conn.bulk.pollTimeout = 60000;

  if (config.settings) {
    slides = config.slides;
    name = functions.getCurNamePresentation();
    hidden = config.presentation.hidden;
    product = config.presentation.brand + '_' + config.presentation.lang;
    lang = config.presentation.lang;
    approved = config.presentation.approved;
  } else {
    console.error('No config file');
    return false;
  }

  Clm_Presentation = [{
    "Name": name,
    "Hidden_vod__c": hidden,
    "Approved_vod__c": approved,
    "Presentation_Id_vod__c": name,
    "Country_Code_AZ__c": lang
  }];

  Product_vod__c = {
    "Name": product
  };

  Key_Message = [];

  for (let i = 0; i < slides.length; i++) {
    let name = functions.getCurNameSlide(slides[i].num);
    Key_Message.push({
      "Name": name,
      "Active_vod__c": true,
      "Description_vod__c": name,
      "Country_Code_AZ__c": lang,
    });
  }

  Clm_Presentation_Slide_vod__c = [];

  for (let i = 0; i < slides.length; i++) {
    let slide = functions.getCurNameSlide(slides[i].num);
    Clm_Presentation_Slide_vod__c.push({
      "Key_Message_vod__c": slide,
      "Clm_Presentation_vod__c": name,
      "External_ID_vod__c": slide + "__" + name,
      "Display_Order_vod__c": slides[i].num === 0 ? 0 : parseInt(slides[i].num) || 999
    });
  }

  function start() {
    // логинимся
  	return new Promise(function(resolve, reject) {
      conn.login(username, password, function(err, userInfo) {
        if (err) { return reject(new Error(err)); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        gutil.log(gutil.colors.grey('Access token: ' + conn.accessToken));
        gutil.log(gutil.colors.grey('Instance url: ' + conn.instanceUrl));

        gutil.log(gutil.colors.grey('User ID: ' + userInfo.id));
        gutil.log(gutil.colors.grey('Org ID: ' + userInfo.organizationId));

        // смотрим есть ли такая преза
        conn.search("FIND {"+name+"} IN ALL FIELDS RETURNING Clm_Presentation_vod__c(Id, Name)",
          function(err, res) {
            if (err) { return reject(new Error(err)); }
            if(res.searchRecords.length) {
              console.log('Present already defined: ' + JSON.stringify(res.searchRecords));
              upsertinsert = 'update';
              Clm_Presentation[0].Id = res.searchRecords[0].Id;
              return resolve('update');
            }else {
              console.log('Creating new presentation: ' + name);
              upsertinsert = 'insert';
              return resolve('insert');
            }
          }
        );
      });
  	});
  }

  start()
  .then(function() {
    // ищем id нужного бренда
    console.log('Searching id for product: ' + Product_vod__c.Name);

    return conn.search("FIND {" + Product_vod__c.Name + "} IN ALL FIELDS RETURNING Product_vod__c(Id, Name)", function(err, res) {
      if(err) throw new Error(err, res);
    });
  })
  .then(function(response) {
    // обновляем поля презы или создаем новую
    if(!response.searchRecords.length) throw new Error('Brand ' + Product_vod__c.Name + ' is not defined in salesforce!');

    Product_vod__c.Id = response.searchRecords[0].Id;
    console.log('Getting product id: ' + Product_vod__c.Id);

    return conn.bulk.load("Clm_Presentation_vod__c", upsertinsert, Clm_Presentation, function(err, res) {
      if (err) throw new Error(err, res);
    });
  })
  .then(function(response) {
    // Обновляем поля презы
    Clm_Presentation[0].Id = response[0].id;
    return conn.sobject("Clm_Presentation_vod__c").update({
      Id : Clm_Presentation[0].Id,
      Presentation_Id_vod__c: Clm_Presentation[0].Presentation_Id_vod__c,
      Name : Clm_Presentation[0].Name,
      Product_vod__c : Product_vod__c.Id
    }, function(err, ret) {
      if (err || !ret.success) { throw new Error(err); }
      gutil.log(gutil.colors.green('Success: create ' + Clm_Presentation[0].Name + ', set brand: ' + Product_vod__c.Name));
    });
  })
  .then(function(response) {
    // получаем список слайдов и их id
    if(!response.success) throw new Error(JSON.stringify(response));

    let query = '';

    for(let i in Key_Message) {
      query += Key_Message[i].Name + ' OR ';
    }

    query = query.slice(0, -4);

    return conn.search("FIND {" + query + "} IN ALL FIELDS RETURNING Key_Message_vod__c(Id, Name)", function(err, res) {
      if(err) throw new Error(err, res);
    });
  })
  .then(function(response) {
    // обновляем поля слайдов
    for(let a in Key_Message) {
      for(let b in response.searchRecords) {
        if(Key_Message[a].Name === response.searchRecords[b].Name) {
          Key_Message[a].Id = response.searchRecords[b].Id;
        }
      }
    }

    return conn.bulk.load("Key_Message_vod__c", "update", Key_Message, function(err, res) {
      if (err) { throw new Error(err, res); }
    });
  })
  .then(function(response) {
    // обновляем поля слайдов
    for(var s in response) {
      if(!response[s].success) throw new Error('Key message is missing in salesforce');
    }

    var data = [];

    for(var s in response) {
      data.push({Id: response[s].id, Product_vod__c : Product_vod__c.Id});
    }

    return conn.sobject("Key_Message_vod__c").update(data, function(err, res) {
      if (err) throw new Error(err, res);
      gutil.log(gutil.colors.green('Success: create key messages'));
    });
  })
  .then(function() {
    // создаем связку презентация-слайд
    return conn.bulk.load("Clm_Presentation_Slide_vod__c", "insert", Clm_Presentation_Slide_vod__c, function(err, res) {
      if (err) { throw new Error(err, res); }
    });

  })
  .then(function() {
    // обновляем связку презентация-слайд
    let query = '';

    for(let i in Key_Message) {
      query += Key_Message[i].Name + ' OR ';
    }

    query = query.slice(0, -4);

    return conn.search("FIND {" + query + "} IN ALL FIELDS RETURNING Clm_Presentation_Slide_vod__c(Id, Name, External_ID_vod__c)", function(err, res) {
      if(err) throw new Error(err, res);
    });

  })
  .then(function(response) {
    var data = [];

    response = response.searchRecords;

    for(let s in Clm_Presentation_Slide_vod__c) {
      for(let c in response) {
        if(Clm_Presentation_Slide_vod__c[s].External_ID_vod__c === response[c].External_ID_vod__c) {
          data.push({
            Id: response[c].Id,
            Display_Order_vod__c: Clm_Presentation_Slide_vod__c[s].Display_Order_vod__c,
          });
        }
      }
    }

    return conn.sobject("Clm_Presentation_Slide_vod__c").update(data, function(err, res) {
      if (err) throw new Error(err, res);
      gutil.log(gutil.colors.green('Success: update clm presentation slide'));
    });

    // return conn.bulk.load("Clm_Presentation_Slide_vod__c", "update", Clm_Presentation_Slide_vod__c, function(err, res) {
    //   if (err) { throw new Error(err, res); }
    // });
  })
  .then(function(response) {
    console.log(response);
  })
  .catch(function(err, mes) {
    if(err) gutil.log(gutil.colors.bgRed(err));
    if(mes) gutil.log(gutil.colors.bgMagenta(mes));
  });


};
