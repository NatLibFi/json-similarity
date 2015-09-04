(function() {

    'use strict';

    var define;

    if  (typeof define !== 'function') {
	define = require('amdefine')(module);
    }

    define(['expect.js', 'fs', '../lib/main'], function(expect, fs, jsonSimilarity) {

	describe('lib', function() {
	    
	    it('Should throw because of invalid JSON data', function() {
		expect(jsonSimilarity).to.throwException();
	    });

	    it('Should throw because specification does not validate against schema', function() {
		expect(jsonSimilarity)
		       .withArgs({},{},{})
		    .to.throwException(function(excp) {
			expect(excp).to.have.property('validation');
		    });
	    });

	    it('Should throw because of invalid JSON path', function() {

		var obj1 = JSON.parse(fs.readFileSync('test/files/obj1.json', {encoding: 'utf8'}));
		var obj2 = JSON.parse(fs.readFileSync('test/files/obj2.json', {encoding: 'utf8'}));
		var spec = JSON.parse(fs.readFileSync('test/files/spec-invalid-syntax.json', {encoding: 'utf8'}));

		expect(jsonSimilarity)
		    .withArgs(obj1, obj2, spec)
		    .to.throwException();
		
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

	});

    });

})();