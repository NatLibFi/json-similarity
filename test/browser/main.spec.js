define(['es6-polyfills/lib/polyfills/promise', '../test'], function(Promise, runTests) {

  'use strict';
 
  runTests(function(path) {
    return new Promise(function(resolveCallback, rejectCallback) {
      
      var xhr = new XMLHttpRequest();
      
      xhr.addEventListener('load', function() {
        
        if (xhr.status < 200 || xhr.status >= 300) {
          rejectCallback(new Error('Failed retrieving resource: ' + xhr.statusText));
        } else { 
          try {
            resolveCallback(xhr.responseText);
          } catch (e) {
            rejectCallback(e);
          }        
        }

      });

      xhr.addEventListener('error', function() {
        rejectCallback('Failed retrieving resource: ' + xhr.statusText);
      });
     
      xhr.open('GET', '/base/' + path);
      xhr.send();      

    });   
  });

});
