(function() {

    'use strict';

    var define;

    if  (typeof define !== 'function') {
	define = require('amdefine')(module);
    }

    define(['expect.js', 'fs', '../lib/cli'], function(expect, fs, cli) {

	describe('cli', function() {

	    it('Should return 1 because of improper number of arguments', function() {

		var stdout = {
		    write: function(){}
		};
		var stderr = {
		    write: function(){}
		};
		
		expect(cli([], stdout, stderr)).to.be(1);

	    });

	    it('Should return 255 because of invalid JSON data', function() {
		
		var stdout = {
		    write: function(){}
		};
		var stderr = {
		    write: function(){}
		};
		
		expect(cli(['', '', ''], stdout, stderr)).to.be(255);

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
				
		expect(cli(['{}', '{}', 'foo'], stdout, stderr)).to.be(255);
		expect(error.length).to.not.be(0);

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
				
		expect(cli(['{}', '{}', '{}'], stdout, stderr)).to.be(255);
		expect(JSON.parse)
		    .withArgs(error)
		    .to.not.throwException();

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

		], stdout, stderr)).to.be(1);

		expect(result).to.be('0\n');

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

		], stdout, stderr)).to.be(0);

		expect(result).to.be('4\n');

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

		], stdout, stderr)).to.be(1);

		expect(result).to.be(fs.readFileSync(file_result, {encoding: 'utf8'}));

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
		    
		], stdout, stderr)).to.be(0);
		
		expect(result).to.be(fs.readFileSync(file_result, {encoding: 'utf8'}));
		
	    });
		  
	});

    });

})();