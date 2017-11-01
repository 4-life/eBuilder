const fs = require('fs');
const gutil = require('gulp-util');
const currentPath = process.env.INIT_CWD;
const json2csv = require('json2csv');

module.exports = function() {
  let descriptions;

  try {
    descriptions = JSON.parse(fs.readFileSync(currentPath + '/descriptions.json', 'utf8'));
    gutil.log('Find custom descriptions...');
  } catch (err) {
    throw new gutil.PluginError({
      plugin: 'excel',
      message: gutil.colors.red('No file `descriptions.json`!')
    });
  }

  var fields = ['slide', 'description'];
  var data = [];

  for(let d in descriptions) {
    data.push({'slide': d, 'description': descriptions[d]});
  }

  var csv = json2csv({ data: data, fields: fields });

  return fs.writeFile(currentPath + '/descriptions.xlsx', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
};
