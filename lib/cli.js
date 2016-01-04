/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file. 
 *
 * Compute similarity of JSON objects with tests that yield points
 *
 * Copyright (c) 2015-2016 University Of Helsinki (The National Library Of Finland)
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

/* istanbul ignore next */
(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['fs', './main'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('fs'), require('./main'));
    }

}(this, factory));

function factory(fs, jsonSimilarity)
{

    'use strict';

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

}