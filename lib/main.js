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
        define([
	    'es6-polyfills/lib/polyfills/object',
	    'object-comparison',
	    'jsonpath',
	    'jjv',
	    'jjve',
	    '../resources/spec-schema.json'
	], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(
	    require('es6-polyfills/lib/polyfills/object'),
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

    function getResult(nodes)
    {

	function copyValue(value)
	{
	    if (typeof value === 'object') {
		return JSON.parse(JSON.stringify(value));
	    } else {
		return value;
	    }
	}

	return nodes.map(function(node) {
	    node.value = copyValue(node.value);
	    return node;
	});

    }
    
    function trim(chars, value, side)
    {
	
	function replaceChars(chars, value, side)
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
	    return replaceChars(chars, value, side);
	} else if (typeof value === 'number') {
	    return Number(replaceChars(chars, value.toString(), side));
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

    function replace(value, pattern, replacement, flags)
    {

	pattern = new RegExp(pattern, flags);

	if (typeof value === 'string') {
	    return value.replace(pattern, replacement);
	} else if (typeof value === 'number') {

	    value = value.toString().replace(pattern, replacement);

	    return isNaN(Number(value)) ? value : Number(value);

	} else {
	    return value;
	}

    }

    function extract(start, length, value)
    {

	if (typeof value === 'string') {

	    start = typeof start === 'number' && start < value.length ? start : 0;
	    length = typeof length === 'number' ? length : value.length - 1;
	    value = value.substr(start, length);

	} else if (typeof value === 'number') {

	    start = typeof start === 'number' && start < value.toString().length ? start : 0;
	    length = typeof length === 'number' ? length : value.toString().length - 1;
	    value = Number(value.toString().substr(start, length));
	    

	} else if (Array.isArray(value)) {

	    start = typeof start === 'number' && start < value.length ? start : 0;
	    length = typeof length === 'number' ? length : value.length - 1;
	    value = value.slice(start, start + length);

	}

	return value;

    }

    function compareMultiValues(a, b, spec, options)
    {

	function normalizePath(path)
	{
		var indexes_count = 0;

		if (options.multimatch.respectHierarchy === false) {

		    return path.reduce(function(path_normalized, component) {
			return Number.isNaN(Number(component)) ? path_normalized.concat('.', component) : path_normalized.concat('.x');
		    });

		} else if (options.multimatch.respectHierarchy === true) {

		    return path.reduce(function(path_normalized, component) {
			return path_normalized.concat('.', component);
		    });

		} else if (options.multimatch.respectHierarchy >= 0) {

		    return path.reduce(function(path_normalized, component) {
			if (!Number.isNaN(Number(component)) && indexes_count++ >= options.multimatch.respectHierarchy) {
			    return path_normalized.concat('.x');
			} else {
			    return path_normalized.concat('.', component);
			}
		    });

		} else {

		    indexes_count = Math.abs(options.multimatch.respectHierarchy);

		    return path.reduceRight(function(path_normalized, component) {
			if (!Number.isNaN(Number(component)) && indexes_count-- > 0) {
			    return path_normalized === undefined ? String(component) : 'x'.concat('.', path_normalized);
			} else {
			    return path_normalized === undefined ? String(component) : String(component).concat('.', path_normalized);
			}			
		    }, undefined);
				
		}

	}

	function getAverage(subject_a, subject_b)
	{

	    var length = options.multimatch.leastTotal !== true ? subject_a.length : subject_a.length < subject_b.length ? subject_a.length : subject_b.length;
	    var paths_match_result = subject_a.reduce(function(result, element) {

		var path = normalizePath(element.path);

		if (!result.hasOwnProperty(path)) {
		    result[path] = {
			total: 1,
			unmatched: 1
		    };
		} else {
		    result[path].total++;
		    result[path].unmatched++;
		}
		
		return result;

	    }, {});
	    var matching = subject_a.reduce(function(match_count, result_a, index) {		

		if (subject_b.some(function(result_b) {
		    return objectCompare(applyModifications(result_a.value, options), applyModifications(result_b.value, options));
		})) {

		    var path = normalizePath(result_a.path);

		    paths_match_result[path].unmatched--;

		    return paths_match_result[path].unmatched === 0 ? match_count + paths_match_result[path].total : match_count;

		} else {
		    return match_count;
		}

	    }, 0);

	    return matching === 0 && length === 0 ? 0 : matching / length;

	}

	var average_percentage = (getAverage(a, b) + getAverage(b, a)) / 2 * 100;

	return {
	    match: average_percentage >= options.multimatch.percentage,
	    percentage: average_percentage
	};

    }

    function applyModifications(value, options)
    {	

	if (value !== undefined) {

	    if (options.hasOwnProperty('extract') && typeof value !== 'object') {
		value = extract(options.extract.start, options.extract.length, value);
	    } else {

		if (options.hasOwnProperty('replace')) {
		    value = replace(value, options.replace.pattern, options.replace.replacement, options.replace.flags);
		}
		
		if (options.hasOwnProperty('trim')) {
		    value = trim(options.trim.chars, value, options.trim.side);
		}
		
		if (options.hasOwnProperty('truncate')) {
		    value = truncate(options.truncate, value);
		}
		
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

    function createTestResult(index, matched, name, percentage)
    {

	var obj = {
	    index: index
	};

	if (typeof name === 'string') {
	    obj.name = name;
	}

	if (typeof matched === 'boolean') {
	    obj.match = matched;
	} else {
	    obj.skipped = true;
	}

	if (percentage !== undefined) {
	    obj.multimatchPercentage = percentage;
	}

	return obj;

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

	var results_tests = [];
	var points;

	validateSpec(spec);
	points = spec.treshold;

	return {	    
	    match: !spec.tests.some(function(test, index_test) {

		var result, result1, result2, skip_missing, matched,
		options = typeof test.options === 'object' ? JSON.parse(JSON.stringify(test.options)) : {};

		if (options.disabled === true) {
		    return false;
		} else {

		    result1 = getResult(jsonpath.nodes(obj1, test.path));
		    result2 = getResult(jsonpath.nodes(obj2, test.path));

		    /**
		     * @todo Should have default value in schema instead
		     */
		    options.multimatch = Object.assign({
			percentage: 100,
			leastTotal: false,
			respectHierarchy: true
		    }, options.multimatch);

		    if (options.hasOwnProperty('singleValue') && options.singleValue === true) {
			result1 = result1.slice(0, 1);
			result2 = result2.slice(0, 1);
		    }
		    
		    if (options.hasOwnProperty('skipMissing') && options.skipMissing === true) {
			skip_missing = 1;
		    }
		    
		    if (!((result1.length === 0 && result2.length === 0) || (skip_missing && (result1.length === 0 || result2.length === 0)))) {

			if (result1.length > 1 && result2.length > 1) {
			    result = compareMultiValues(result1, result2, spec, options);
			} else if (result1.length === 1 && result2.length === 1) {
			    result = objectCompare(
				applyModifications(result1.shift().value, options),
				applyModifications(result2.shift().value, options),
				options
			    );
			} else {
			    result = false;
			}
			
			if (typeof result === 'object' && result.match === true || typeof result === 'boolean' && result === true) {

			    matched = true;
			    points = test.hasOwnProperty('true')
				? points + test['true']
				: points;

			} else {

			    matched = false;
			    points = test.hasOwnProperty('false')
				? points + test['false']
				: points;

			}

		    }
		    
		    results_tests.push(createTestResult(index_test, matched, test.name, typeof result === 'object' ? result.percentage : undefined));

		    return points < spec.treshold;

		}
		
	    }),
	    points: points,
	    tests: results_tests
	};
	
    };

}
