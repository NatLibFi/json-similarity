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

(function(root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['chai', 'fs', '../lib/cli'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('chai'), require('fs'), require('../lib/cli'));
    }

}(this, factory));

function factory(chai, fs, cli)
{

    'use strict';

    var expect = chai.expect;

    describe('cli', function() {

	it('Should return 1 because of improper number of arguments', function() {

	    var stdout = {
		write: function(){}
	    };
	    var stderr = {
		write: function(){}
	    };
	    
	    expect(cli([], stdout, stderr)).to.equal(1);

	});

	it('Should return 255 because of invalid JSON data', function() {
	    
	    var stdout = {
		write: function(){}
	    };
	    var stderr = {
		write: function(){}
	    };
	    
	    expect(cli(['', '', ''], stdout, stderr)).to.equal(255);

	});

	it('Should return -1 and write an error to stderr because of invalid file', function() {

	    var error = '';
	    var stdout = {
		write: function(){}
	    };
	    var stderr = {
		write: function(chunk) {
		    error += chunk;
		}
	    };
	    
	    expect(cli(['{}', '{}', 'foo'], stdout, stderr)).to.equal(255);
	    expect(error.length).to.be.greaterThan(0);

	});

	it('Should return -1 and write JSON to stderr because specification does not validate against schema', function() {

	    var error = '';
	    var stdout = {
		write: function(){}
	    };
	    var stderr = {
		write: function(chunk) {
		    error += chunk;
		}
	    };
	    
	    expect(cli(['{}', '{}', '{}'], stdout, stderr)).to.equal(255);
	    expect(error).to.match(/^Failed: \[/);

	});

	it('Should return 1 and write 0 to stdout because objects do not match', function() {
	    
	    var result = '';
	    var file_obj1 = 'test/files/obj1.json';
	    var file_obj2 = 'test/files/obj2.json';
	    var file_spec = 'test/files/cli-spec1and3.json';
	    var stdout = {
		write: function(chunk){
		    result += chunk;
		}
	    };
	    var stderr = {
		write: function(chunk) {}
	    };
	    
	    expect(cli([

		file_obj1,
		file_obj2,
		file_spec

	    ], stdout, stderr)).to.equal(1);

	    expect(result).to.equal('0\n');

	});

	it('Should return 0 and write 4 to stdout because objects match', function() {

	    var result = '';
	    var file_obj1 = 'test/files/obj1.json';
	    var file_obj2 = 'test/files/obj2.json';
	    var file_spec = 'test/files/cli-spec2and4.json';
	    var stdout = {
		write: function(chunk){
		    result += chunk;
		}
	    };
	    var stderr = {
		write: function(chunk) {}
	    };
	    
	    expect(cli([

		file_obj1,
		file_obj2,
		file_spec

	    ], stdout, stderr)).to.equal(0);

	    expect(result).to.equal('4\n');

	});

	it('Should return 1 and write the expected JSON to stdout because objects do not match and verbose output is requested', function() {

	    var result = '';
	    var file_obj1 = 'test/files/obj1.json';
	    var file_obj2 = 'test/files/obj2.json';
	    var file_spec = 'test/files/cli-spec1and3.json';
	    var file_result = 'test/files/cli-verbose-failure.json';
	    var stdout = {
		write: function(chunk){
		    result += chunk;
		}
	    };
	    var stderr = {
		write: function(chunk) {}
	    };
	    
	    expect(cli([

		'-v',
		file_obj1,
		file_obj2,
		file_spec

	    ], stdout, stderr)).to.equal(1);

	    expect(result).to.eql(fs.readFileSync(file_result, {encoding: 'utf8'}));

	});

	it('Should return 0 and write the expected JSON to stdout because objects match and verbose output is requested', function() {
	    
	    var result = '';
	    var file_obj1 = 'test/files/obj1.json';
	    var file_obj2 = 'test/files/obj2.json';
	    var file_spec = 'test/files/cli-spec2and4.json';
	    var file_result = 'test/files/cli-verbose-success.json';
	    var stdout = {
		write: function(chunk){
		    result += chunk;
		}
	    };
	    var stderr = {
		write: function(chunk) {}
	    };
	    
	    expect(cli([
		
		'-v',
		file_obj1,
		file_obj2,
		file_spec
		
	    ], stdout, stderr)).to.equal(0);
	    
	    expect(result).to.eql(fs.readFileSync(file_result, {encoding: 'utf8'}));
	    
	});
	
    });

}