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

/* istanbul ignore next */
(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['object-comparison', 'jsonpath', 'jjv', 'jjve', '../resources/spec-schema.json'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('object-comparison'), require('jsonpath'), require('jjv'), require('jjve'), require('../resources/spec-schema.json'));
    }

}(this, factory));

function factory(objectCompare, jsonpath, jjv, jjve, schema)
{

    'use strict';

    function copyValue(value)
    {
	if (typeof value === 'object') {
	    if (Array.isArray(value)) {
		return [].concat(value);
	    } else {
		return JSON.parse(JSON.stringify(value));
	    }
	} else {
	    return value;
	}
    }
    
    function trim(chars, value, side)
    {
	
	function replace(chars, value, side)
	{
	    switch (side) {
	    case 0:
		return value.replace(new RegExp('^[' + chars + ']+'), '');
	    case 1:
		return value.replace(new RegExp('[' + chars + ']+$'), '');
	    default:
		return value.replace(new RegExp('^[' + chars + ']+'), '')
		    .replace(new RegExp('[' + chars + ']+$'), '');
	    }
	}
	
	if (typeof value === 'string') {
	    return replace(chars, value, side);
	} else if (typeof value === 'number') {
	    return Number(replace(chars, value.toString(), side));
	} else {
	    return value;
	}
    }
    
    function truncate(length, value)
    {
	if (typeof value === 'string') {
	    
	    return length > 0
		? value.substr(0, length)
		: value.substr(length, Math.abs(length));
	    
	} else if (typeof value === 'number') {
	    
	    var str_value = value.toString();
	    
	    str_value = length > 0
		? str_value.substr(0, length)
		: str_value.substr(length, Math.abs(length));
	    
	    return Number(str_value);
	    
	} else {
	    return value;
	}
    }

    function extract(start, end, value)
    {

	if (typeof value === 'string') {

	    start = typeof start === 'number' && start < value.length ? start : 0;
	    end = typeof end === 'number' ? end : value.length - 1;
	    value = value.substr(start, end);

	} else if (typeof value === 'number') {

	    start = typeof start === 'number' && start < value.length ? start : 0;
	    end = typeof end === 'number' ? end : value.length - 1;
	    value = Number(value.toString().substr(start, end));
	    

	} else if (Array.isArray(value)) {

	    start = typeof start === 'number' && start < value.length ? start : 0;
	    end = typeof end === 'number' ? end : value.length - 1;
	    value = value.slice(start, start + end);

	}

	return value;

    }

    function validateSpec(spec)
    {
	var env = jjv();
	var je = jjve(env);
	var errors = env.validate(schema, spec, {
	    useDefault: true
	});

	if (errors) {
	    throw new Error(JSON.stringify(je(schema, spec, errors), undefined, 4));
	}

    }

    /**
     * For each match test, do the following:
     * 1) Get property from both objects
     * 2) Compare according to options (Strict/loose matching etc.)
     * 3) Add/subtract points according to options
     * 4) Fail if the points are below treshold
     */	
    return function(obj1, obj2, spec)
    {	    

	var points;

	validateSpec(spec);
	points = spec.treshold;
	
	return {
	    match: !spec.tests.some(function(test) {
		
		var result, skipMissing, extract_start, extract_end;
		var value1 = copyValue(jsonpath.value(obj1, test.path));
		var value2 = copyValue(jsonpath.value(obj2, test.path));
		
		if ('options' in test) {

		    if ('skipMissing' in test.options && test.options.skipMissing === true) {
			skipMissing = 1;
		    }

		    if ('extract' in test.options) {
			value1 = extract(test.options.extract.start, test.options.extract.end, value1);
			value2 = extract(test.options.extract.start, test.options.extract.end, value2);
		    } else {

			if ('trim' in test.options) {
			    value1 = trim(test.options.trim.chars, value1, test.options.trim.side);
			    value2 = trim(test.options.trim.chars, value2, test.options.trim.side);
			}

			if ('truncate' in test.options) {
			    value1 = truncate(test.options.truncate, value1);
			    value2 = truncate(test.options.truncate, value2);
			}
			
		    }

		}
		
		if (value1 === undefined && value2 === undefined) {
		    return true;
		} else if (skipMissing && (value1 === undefined || value2 === undefined)) {
		    return true;
		} else {

		    result = objectCompare(
			value1,
			value2,
			test.options
		    );

		    if (result) {
			points = 'true' in test
			    ? points + test['true']
			    : points;
		    } else {
			points = 'false' in test
			    ? points + test['false']
			    : points;
		    }

		    return points < spec.treshold;

		}
		
	    }),
	    points: points
	};
	
    };

}