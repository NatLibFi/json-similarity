(function() {

    'use strict';

    var define;

    if (define === undefined) {
	define = require('amdefine')(module);
    }

    define(['../lib/main', 'fs'], function(jsonSimilarity, fs) {
	return function(argv, stdout, stderr)
	{

	    var verbose;
	    var usage = 'json-similarity [-v] <OBJECT1> <OBJECT2> <SPEC>';

	    argv = argv === undefined ? process.argv.slice(2) : argv;
	    stdout = stdout === undefined ? process.stdout : stdout;
	    stderr = stderr === undefined ? process.stderr : stderr;
	    
	    function getJsonObject(str)
	    {
		if (fs.existsSync(str)) {
		    return JSON.parse(fs.readFileSync(
			str, {encoding: 'utf8'}
		    ));
		} else {
		    return JSON.parse(str);
		}
	    }

	    if (argv.length < 3) {
		stderr.write(usage + '\n');
		return 1;
	    } else if (argv.length === 4) {
		verbose = 1;
		argv.shift();
	    }
	    
	    try {
		
		var obj1 = getJsonObject(argv[0]);
		var obj2 = getJsonObject(argv[1]);
		var spec = getJsonObject(argv[2]);

		var result = jsonSimilarity(obj1, obj2, spec);
		
		if (verbose) {
		    stdout.write(JSON.stringify(result) + '\n');
		} else {
		    stdout.write(result.points + '\n');
		}
		
		return result.match ? 0 : 1;
		
	    } catch (excp) {
		if ('message' in excp) {
		    stderr.write('Failed: ' + excp.message + '\n');
		} else {
		    stderr.write(JSON.stringify(excp, undefined, '\t') + '\n');
		}
		return 255;
	    }
	    
	};	
    });
})();