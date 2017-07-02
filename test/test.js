/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file. 
 *
 * Compute similarity of JSON objects with tests that yield points
 *
 * Copyright (c) 2015-2017 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of json-similarity 
 *
 * json-similarity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.   See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 **/

(function (root, factory) {
  
  'use strict';
  
  if (typeof define === 'function' && define.amd) {
    define([
      '@natlibfi/es6-polyfills/lib/polyfills/promise',
      'chai/chai',
      '../lib/main'
    ], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('@natlibfi/es6-polyfills/lib/polyfills/promise'),
      require('chai'),
      require('../lib/main')
    );
  }
  
}(this, factory));

function factory(Promise, chai, jsonSimilarity)
{
  
  'use strict';
  
  return function(getResource)
  {

    function iterateSuites(suites, result)
    {

      var suite = suites.shift();

      result = result === undefined ? [] : result;
      
      if (suite === undefined) {
        return Promise.resolve(result);
      } else {
        
        return iterateTests(suite.tests).then(function(tests) {
          
          suite.tests = tests;
          
          result.push(suite);
          
          return iterateSuites(suites, result);
          
        });

      }

    }

    function iterateTests(tests, result)
    {
      
      var test = tests.shift();

      result = result === undefined ? [] : result;

      if (test === undefined) {
        return Promise.resolve(result);
      } else {
        return getResource(test).then(JSON.parse).then(function(test) {

          result.push(test);          
          return iterateTests(tests, result);
          
        });
      }
      
    }

    function buildSuite(suite)
    {
      describe(suite.description, function() {
        suite.tests.forEach(buildTest);
      });     
    }

    function buildTest(test)
    {
      it(test.description, function() {
        
        if (test.error) {
          expect(function() {
            jsonSimilarity(test.objectA, test.objectB, test.spec);
          }).to.throw(Error, JSON.stringify(test.errors));

        } else {
          expect(jsonSimilarity(test.objectA, test.objectB, test.spec)).to.eql(test.result);
        }
        
      });
    }

    var expect = chai.expect;

    getResource('test/suites.json').then(JSON.parse).then(function(index) {      
      return iterateTests(index.tests).then(function(tests) {    

        index.tests = tests;

        return iterateSuites(index.suites).then(function(suites) {
          
          index.suites = suites;
          
          describe('main', function() {
            
            index.tests.forEach(buildTest);
            index.suites.forEach(buildSuite);

          });
          
          run();
          
        });       
      });
    }).catch(function(e) {
      
      if (e.hasOwnProperty('stack')) {        
        console.error(e.message);
        console.error(e.stack);
      } else {
        console.error(e);
      }

      run();

    });

  };
  
}
