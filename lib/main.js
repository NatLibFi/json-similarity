(function() {

    'use strict';

    var define;

    if (typeof define !== 'function') {
	define = require('amdefine')(module);
    }

    define(['jsonpath', 'object-comparison', 'json-schema-config', '../resources/spec-schema.json'], function(jsonpath, objectCompare, jsonSchemaConfig, schema) {

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

	    spec = jsonSchemaConfig(spec, schema);	    
	    points = spec.treshold;
	    
	    return {
		match: !spec.tests.some(function(test) {
		    
		    var result;
		    var value1 = copyValue(jsonpath.value(obj1, test.path));
		    var value2 = copyValue(jsonpath.value(obj2, test.path));
		    
		    if ('options' in test) {
			if ('trim' in test.options) {
			    value1 = trim(test.options.trim.chars, value1, test.options.trim.side);
			    value2 = trim(test.options.trim.chars, value2, test.options.trim.side);
			}
			if ('truncate' in test.options) {
			    value1 = truncate(test.options.truncate, value1);
			    value2 = truncate(test.options.truncate, value2);
			}
		    }
		    
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
		    
		}),
		points: points
	    };
	    
	};

    });

})();