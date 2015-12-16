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
        define([
	    'es6-polyfills/lib/object',
	    'object-comparison',
	    'jsonpath',
	    'jjv',
	    'jjve',
	    '../resources/spec-schema.json'
	], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
	    require('es6-polyfills/lib/object'),
	    require('object-comparison'),
	    require('jsonpath'),
	    require('jjv'),
	    require('jjve'),
	    require('../resources/spec-schema.json')
	);
    }

}(this, factory));

function factory(Object, objectCompare, jsonpath, jjv, jjve, schema)
{

    'use strict';

    function copyValue(value)
    {
	if (typeof value === 'object') {
	    return JSON.parse(JSON.stringify(value));
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

    function compareMultiValues(a, b, spec, options)
    {

	function getAverage(subject_a, subject_b)
	{

	    var length = spec.leastTotal !== true ? subject_a.length : subject_a.length < subject_b.length ? subject_a.length : subject_b.length;
	    var matching = subject_a.reduce(function(match_count, value_a) {
		
		return subject_b.some(function(value_b) {
		    return objectCompare(applyModifications(value_a, options), applyModifications(value_b, options));
		}) ? match_count + 1 : match_count;
		
	    }, 0);

	    return matching === 0 && length === 0 ? 0 : matching / length;

	}

	var average_percentage = (getAverage(a, b) + getAverage(b, a)) / 2 * 100;

	return average_percentage >= spec.percentage;

    }

    function applyModifications(value, options)
    {
	
	if ('extract' in options && typeof value !== 'object') {
	    value = extract(options.extract.start, options.extract.end, value);
	} else {
	    
	    if ('trim' in options) {
		value = trim(options.trim.chars, value, options.trim.side);
	    }
	    
	    if ('truncate' in options) {
		value = truncate(options.truncate, value);
	    }
	    
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
		
		var result, skip_missing,
		multimatch = {
		    percentage: 100,
		    leastTotal: false
		},
		value1 = copyValue(jsonpath.query(obj1, test.path)),
		value2 = copyValue(jsonpath.query(obj2, test.path));
		
		if (Array.isArray(value1) === true && Array.isArray(value2) === true) {
		    if (value1.length === 1 && value2.length === 1) {
			value1 = value1.shift();
			value2 = value2.shift();
		    } else if (value1.length === 0 && value2.length === 0) {
			value1 = undefined;
			value2 = undefined;
		    }
		}

		if (typeof test.options === 'object') {

		    if ('singleValue' in test.options && test.options.singleValue === true) {
			value1 = Array.isArray(value1) ? value1[0] : value1;
			value2 = Array.isArray(value2) ? value2[0] : value2;
		    }

		    if ('skipMissing' in test.options && test.options.skipMissing === true) {
			skip_missing = 1;
		    }

		    if ('multimatch' in test.options) {
			multimatch = Object.assign(multimatch, test.options.multimatch);
		    }

		}

		if (!((value1 === undefined && value2 === undefined) || (skip_missing && (value1 === undefined || value2 === undefined)))) {
		    
		    if (Array.isArray(value1) || Array.isArray(value2)) {
			
			value1 = Array.isArray(value1) ? value1 : [value1];
			value2 = Array.isArray(value2) ? value2 : [value2];
			
			result = compareMultiValues(value1, value2, multimatch, typeof test.options === 'object' ? test.options : {});
			
		    } else {
			result = objectCompare(
			    applyModifications(value1, typeof test.options === 'object' ? test.options : {}),
			    applyModifications(value2, typeof test.options === 'object' ? test.options : {}),
			    test.options
			);
		    }
		    
		    if (result) {
			points = 'true' in test
			    ? points + test['true']
			    : points;
		    } else {
			points = 'false' in test
			    ? points + test['false']
			    : points;
		    }

		}
		    
		return points < spec.treshold;
		
	    }),
	    points: points
	};
	
    };

}