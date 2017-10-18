const config = global.config;
// const path = require('path');
// const fs = require('fs');
const gutil = require('gulp-util');
const ftpData = require('../config/.ftp.json');
const functions = require('../config/functions');

const jsforce = require('jsforce');

module.exports = function() {
  let slides, name, Clm_Presentation, Product_vod__c, Key_Message, Clm_Presentation_Slide_vod__c, Detail_Group_vod__c, Disable_Actions_vod__c, hidden, product, detailGroup, lang, approved, groups, upsertinsert;

  var conn = new jsforce.Connection({
    loginUrl : 'https://test.salesforce.com'
  });
  var username = ftpData.user;
  var password = ftpData.pass + ftpData.token;

  conn.bulk.pollInterval = 5000;
  conn.bulk.pollTimeout = 60000;
  conn.bulk.maxRequest = 100;

  if (config.settings) {
    slides = config.slides;
    name = functions.getCurNamePresentation();
    hidden = config.presentation.hidden;
    product = config.presentation.brand + '_' + config.presentation.lang;
    lang = config.presentation.lang;
    approved = config.presentation.approved;
    groups = config.presentation.groups;
    detailGroup = config.presentation.detailGroup;
    Disable_Actions_vod__c = config.presentation.disableActions;
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

  Detail_Group_vod__c = {
    "Name": detailGroup
  };

  Key_Message = [];

  for (let i = 0; i < slides.length; i++) {
    let name = functions.getCurNameSlide(slides[i].num);
    Key_Message.push({
      "Name": name,
      "Active_vod__c": true,
      "Description_vod__c": name,
      "Country_Code_AZ__c": lang,
      "Groups_AZ__c": groups,
      "Disable_Actions_vod__c": Disable_Actions_vod__c
    });
  }

  Clm_Presentation_Slide_vod__c = [];

  for (let i = 0; i < slides.length; i++) {
    let slide = functions.getCurNameSlide(slides[i].num);
    Clm_Presentation_Slide_vod__c.push({
      "Key_Message_vod__c": slide,
      "External_ID_vod__c": slide + "__" + name,
      "Display_Order_vod__c": slides[i].num === 0 ? 0 : parseInt(slides[i].num) || (700 + i)
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
        name = name.replace(/-/g, '\\-').replace(/\//g, '\/');
        conn.search("FIND {"+name+"} IN ALL FIELDS RETURNING Clm_Presentation_vod__c(Id, Name)",
          function(err, res) {
            if (err) { return reject(new Error(err)); }
            if(res.searchRecords.length) {
              console.log('Present already defined: ' + res.searchRecords[0].Name);
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

    return conn.search("FIND {" + Product_vod__c.Name + " OR " + Detail_Group_vod__c.Name + "} IN ALL FIELDS RETURNING Product_vod__c(Id, Name)", function(err, res) {
      if(err) throw new Error(err, res);
    });
  })
  .then(function(response) {
    // ищем id продукта и детэйл групп
    if(!response.searchRecords.length) throw new Error('Products ' + Product_vod__c.Name + ' or ' + Detail_Group_vod__c.Name + ' is not defined in salesforce!');

    for (let prod in response.searchRecords) {
      if(response.searchRecords[prod].Name === Product_vod__c.Name) {
        Product_vod__c.Id = response.searchRecords[prod].Id;
      }
      if(response.searchRecords[prod].Name === Detail_Group_vod__c.Name) {
        Detail_Group_vod__c.Id = response.searchRecords[prod].Id;
      }
    }

    if(!Product_vod__c.Id) throw new Error('Product ' + Product_vod__c.Name + ' is not defined in salesforce!');
    if(!Detail_Group_vod__c.Id) throw new Error('Detail Group ' + Detail_Group_vod__c.Name + ' is not defined in salesforce!');

    // обновляем поля презы или создаем новую
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
      gutil.log(gutil.colors.green('Success: ' + Clm_Presentation[0].Name + ', set brand: ' + Product_vod__c.Name));
    });
  })
  .then(function(response) {
    // получаем список слайдов и их id
    if(!response.success) throw new Error(JSON.stringify(response));

    let query = [];

    for(let i in Key_Message) {
      query.push(Key_Message[i].Name);
    }

    var q = "SELECT Id, Name, Media_File_Name_vod__c FROM Key_Message_vod__c WHERE Name = '" + query.join("' OR Name = '") + "'";

    var p1 = new Promise((resolve) => {
        conn.query(q).then(function(response) {
            resolve(response);
        });
    });

    return Promise.all([p1]);
  })
  .then(function(response) {
    response = response[0];
    if(!response) {
        throw new Error('Key_Messages is missing in salesforce');
    }

    if(Key_Message.length !== response.records.length) {
      throw new Error('Current presentation has ' + Key_Message.length + ' slides, but salesforce returned ' + response.records.length + ' slides! Remove unnecessary slides from salesforce or add missing');
    }

    // обновляем поля слайдов
    for(let a in Key_Message) {
      for(let b in response.records) {
        if(!response.records[b].Media_File_Name_vod__c) {
            throw new Error('Key_Message ' + response.records[b].Name + ' has no zip data!');
        }
        if(Key_Message[a].Name === response.records[b].Name) {
          Key_Message[a].Id = response.records[b].Id;
          Key_Message[a].Detail_Group_vod__c = Detail_Group_vod__c.Id;
          Key_Message[a].Product_vod__c = Product_vod__c.Id;
        }
      }
    }

    for(let c in Clm_Presentation_Slide_vod__c) {
      Clm_Presentation_Slide_vod__c[c].Clm_Presentation_vod__c = Clm_Presentation[0].Id;

      for(let b in response.records) {
        if(Clm_Presentation_Slide_vod__c[c].Key_Message_vod__c === response.records[b].Name) {
          Clm_Presentation_Slide_vod__c[c].Key_Message_vod__c = response.records[b].Id;
        }
      }
    }

    // обновляем поля слайдов
    return conn.bulk.load("Key_Message_vod__c", "update", Key_Message, function(err, res) {
      if (err) { throw new Error(err, res); }
      gutil.log('Try to update Key_Message_vod__c fields...');
    });
  })
  .then(function(response) {
    for(var s in response) {
      if(!response[s].success) throw new Error('Error with Key message: ' + response[s].errors.join('; '));
    }

    gutil.log(gutil.colors.green('Success: update Key Message fields!'));

    // обновляем связку презентация-слайд
    var q = "SELECT Id, Name, External_ID_vod__c FROM Clm_Presentation_Slide_vod__c WHERE Clm_Presentation_vod__c = '" + Clm_Presentation[0].Id + "'";

    var q1 = new Promise((resolve) => {
        conn.query(q).then(function(res) {
            resolve(res);
        });
    });

    return Promise.all([q1]);
  })
  .then(function(response) {
    response = response && response[0].records;

    if(response) {
      // обновляем связку презентация-слайд
      gutil.log(gutil.colors.green('Find Clm_Presentation_Slides, update data...'));
      let data = [];
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

      return conn.sobject("Clm_Presentation_Slide_vod__c").updateBulk(data, function(err, res) {
        if (err) throw new Error(err, res);
        gutil.log(gutil.colors.green('Success: update clm presentation slide'));
      });
    }else{
      // создаем связку презентация-слайд
      gutil.log(gutil.colors.green('No Clm_Presentation_Slides, creating...'));
      return conn.bulk.load("Clm_Presentation_Slide_vod__c", "insert", Clm_Presentation_Slide_vod__c, function(err, res) {
        if (err) { throw new Error(err, res); }
        gutil.log('Try to create Clm_Presentation_Slide_vod__c...');
      });
    }
  })
  .then(function(response) {
    for(var s in response) {
      if(!response[s].success) throw new Error('Something went wrong!');
    }
    gutil.log(gutil.colors.green('Success creating!'));
  })
  .catch(function(err, mes) {
    if(err) gutil.log(gutil.colors.bgRed(err));
    if(mes) gutil.log(gutil.colors.bgMagenta(mes));
  });


};
