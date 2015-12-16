/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file. 
 *
 * Compute similarity of JSON objects with tests that yield points
 *
 * Copyright (c) 2015 University Of Helsinki (The National Library Of Finland)
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
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
        define(['chai', 'fs', '../lib/main'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('chai'), require('fs'), require('../lib/main'));
    }

}(this, factory));

function factory(chai, fs, jsonSimilarity)
{

    'use strict';

    var expect = chai.expect;

    describe('lib', function() {
	
	it('Should throw because of invalid JSON data', function() {

	    expect(jsonSimilarity).to.throw(Error);

	    try {
		jsonSimilarity();
	    } catch (excp) {
		expect(JSON.parse(excp.message)).to.eql([{
		    code: 'VALIDATION_INVALID_TYPE',
		    message: 'Invalid type: undefined should be object',
		    path: '$'
		}]);
	    }

	});

	it('Should throw because specification does not validate against schema', function() {
	    
	    expect(function(){
		jsonSimilarity({}, {}, {});
	    }).to.throw();

	    try {
		jsonSimilarity({}, {}, {});
	    } catch (excp) {
		expect(JSON.parse(excp.message)).to.eql([
		    {
			code: 'VALIDATION_OBJECT_REQUIRED',
			message: 'Missing required property: treshold',
			path: '$.treshold'
		    },
		    {
			code: 'VALIDATION_OBJECT_REQUIRED',
			message: 'Missing required property: tests',
			path: '$.tests'
		    }
		]);
	    }

	});


	it('Should throw because of invalid JSON path', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec-invalid-syntax.json', {encoding: 'utf8'}));

	    expect(function(){
		jsonSimilarity(obj1, obj2, spec);
	    }).to.throw(Error);

	    try {
		jsonSimilarity(obj1, obj2, spec);
	    } catch (excp) {
		expect(JSON.parse(excp.message)).to.eql([{
		    code: 'VALIDATION_INVALID_TYPE',
		    message: 'Invalid type: integer should be string',
		    data: 0,
		    path: '$.tests[0].path'
		}]);
	    }
	    
	});

	it('Should return a true match and 4 points', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec1.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a false match and 1 points', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec2.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 1
	    });

	});

	it('Should return a true match and 4 points because strings are now trimmed', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec6.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a false match and 4 points because strings are now trimmed from the start', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec7.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it('Should return a true match and 4 points because strings are now trimmed from the end', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec8.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a true match and 4 points because numbers are now trimmed', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec9.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a true match and 4 points because numbers are now trimmed from the start', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec10.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a false match and 0 points because numbers are now trimmed from the end', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec11.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it('Should return a true match and 4 points because strings are now truncated', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec12.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a false match and 0 points because strings are now truncated from the end', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec13.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it('Should return a true match and 4 points because numbers are now truncated', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec14.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a false match and 0 points because numbers are now truncated from the start', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec15.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it('Should return a true match and 4 points because strings are now trimmed and truncated', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec16.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });
	    
	});

	it('Should return a true match and 4 points because numbers are now trimmed and truncated', function() {
	    
	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec17.json', {encoding: 'utf8'}));
	    
	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });
	    
	});
	
	it('Should return a true match and 4 points because values are now trimmed, truncated and loosely equal, because strict-option is false', function() {
	    
	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec18.json', {encoding: 'utf8'}));
	    
	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });
	    
	});
	
	it('Should return a false match and 0 points because values are compared strictly', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec19.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});
	
	it('Should return a true match and 4 points because array values are not compared in order', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec20.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a false match and 0 points as the test is skipped because both values are undefined', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec21.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 2
	    });

	});

	it('Should return a false match and 0 points as the test is skipped because the other is undefined and skipMissing is true', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec22.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it('Should return a true match and 2 points because extracted string values match', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec23.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a true match and 2 points because extracted number values match', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec24.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it("Should return a false match and 0 points because other object's value cannot be extracted", function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec26.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it("Should return a true match and 4 points because the other object's multivalue is reduced to single value", function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec27.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

	it('Should return a false match and 0 points because the multivalue percentage average not 100% (Default)', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec28.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it('Should return a false match and 0 points because the multivalue percentage average is not large enough', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec29.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: false,
		points: 0
	    });

	});

	it('Should return a true match and 4 points because the multivalue percentage average is large enough (Because leastTotal-option is true', function() {

	    var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
	    var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
	    var spec = JSON.parse(fs.readFileSync('test/files/spec30.json', {encoding: 'utf8'}));

	    expect(jsonSimilarity(obj1, obj2, spec)).to.eql({
		match: true,
		points: 4
	    });

	});

    });
}