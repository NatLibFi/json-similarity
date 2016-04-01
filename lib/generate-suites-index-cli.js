module.exports = function(directory)
{
 
  'use strict';
 
  var fs = require('fs'),
  path = require('path'),
  obj = {
    tests: [],
    suites: []
  };

  directory = typeof directory === 'string' ? directory : 'test/suites';

  fs.readdirSync(directory).forEach(function(file) {

    var suite,
    path_file = path.join(directory, file);

    if (fs.statSync(path_file).isDirectory()) {

      suite = {
        description: file,
        tests: []
      };

      fs.readdirSync(path_file)
        .filter(function(file_subdir) {
          return fs.statSync(path.join(path_file, file_subdir)).isFile();
        })
        .forEach(function(file_subdir) {
          suite.tests.push(path.join(path_file, file_subdir));
        });

      obj.suites.push(suite);

    } else {
      obj.tests.push(path_file);
    }

  });

  console.log(JSON.stringify(obj, undefined, 4));

};
