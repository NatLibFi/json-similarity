# JSON similarity

Compute similarity of JSON objects with tests that yield points. Each test add or subtracts points. If total number of points becomes less than the treshold, the objects are deemed not similar. If all tests pass without the total number of points becoming less than the treshold, the objects are similar.

## Usage

The module returns a single function which, when run, returns an object with the following properties:

* **match** (*boolean*): Whether the objects match or not
* **points** (*number*): Total number of points

### AMD

```javascript
define(['json-similarity'], function(jsonSimilarity) {
  console.log(jsonSimilarity(o1, o2, spec));
});
```

### Node.js

```javascript
var jsonSimilarity = require('json-similarity');

console.log(jsonSimilarity(o1, o2, spec));

```

## Configuration

**SEE resources/spec-schema.json FOR reference**

Test spec is passed as a third argument to the similarity function. The object has the following properties:

#### treshold (*number*)
Number of points that is expected to be reached for the records to be deemed similar.

#### tests (*array*)
An array of tests to be run. Each test is an object which can have the following properties:

* **true** (*number*): Number of points to be added if the test succeeds (If omitted the points are added only if the test fails).
* **false** (*number*): Number of points to be added if the test fails (If omitted the points are added only if the test succeeds).
* **path** (*string*): **Mandatory** The path to test for.
* **options** (*object*): Options can have the following properties:
  * **trim** (*object*): Operates on strings and numbers
    * **chars** (*string*): Characters to trims
    * **side** (*number*): If 0, trim from beginning of the property. If 1, trim from the end. If undefined, trim from both ends
  * **truncate** (*number*): Number of characters to truncate the target property to. Posite values truncate from the beginning, negative from the end. Operates on strings and numbers;
  * **strict** (*boolean*): Compare properties with strict equality (===)
  * **order** (*boolean*): Require elements to be in the same order when comparing array properties

### Examples

*TODO*

## License and copyright

Copyright (c) 2015 University Of Helsinki (The National Library Of Finland)

This project's source code is licensed under the terms of **GNU General Public License Version 3**.