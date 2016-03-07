/**
 * Utility function returning the count of an object's own properties.
 * @param {object} obj - Object to test.
 * @returns {number} number of object's own properties
 */
exports.objectLength = function(obj) {
  var length = 0;
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      length++;
    }
  }
  return length;
};

/**
 * Utility function to establish prototype inheritance.
 * @see {@link http://javascript.crockford.com/prototypal.html|Prototypal Inheritance}
 * @param {function} constructor - Contstructor function to set as derived.
 * @param {function} superConstructor - Contstructor function to set as base.
 * @param {string} [name] - Type name to set as name property in derived prototype.
 */
exports.inherits: function(constructor, superConstructor, name) {
  constructor.prototype = Object.create(superConstructor.prototype);
  constructor.prototype.name = name || "";
};
