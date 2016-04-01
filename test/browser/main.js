(function() {

  'use strict';

  function formatPath(path) {
    return path.replace(new RegExp('^/base/'), '').replace(/\.js$/, '');
  }

  var spec_list = [];
  
  Object.keys(window.__karma__.files).forEach(function(file) {
    if (new RegExp('^/base/test/').test(file) === true && new RegExp('/nodejs/').test(file) === false && new RegExp('spec\.js$', 'i').test(file) === true) {
      spec_list.push(formatPath(file));
    }
  });
  
  require.config({
    baseUrl: '/base',
    paths: {
      'chai': 'node_modules/chai/chai',
      'es6-polyfills': 'node_modules/es6-polyfills',
      'es6-object-assign': 'node_modules/es6-polyfills/node_modules/es6-object-assign',
      'es6-promise-polyfill': 'node_modules/es6-polyfills/node_modules/es6-promise-polyfill/promise',
      'object-comparison': 'node_modules/object-comparison/lib/main',
      'jjv': 'node_modules/jjv/lib/jjv',
      'jjve': 'node_modules/jjve/jjve',
      'jsonpath': 'node_modules/jsonpath/jsonpath',
      'json': 'node_modules/requirejs-plugins/src/json',
      'text': 'node_modules/requirejs-plugins/lib/text',
    },
    deps: spec_list,
    callback: window.__karma__.start
  });
  
})();
