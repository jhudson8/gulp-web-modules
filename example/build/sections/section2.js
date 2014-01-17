define(function() { var sectionExports = {}; if (typeof global === 'undefined') { var global = window; } function requireSection (name, callback) { var names = Array.isArray(name) ? name : [name]; for (var i=0; i<names.length; i++) { names[i] = 'sections/' + names[i]; }  require(names, callback); }
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};global.Bus.trigger('section2');

var user = require('./userInfo');
sectionExports.user = user();


},{"./userInfo":2}],2:[function(require,module,exports){
module.exports = function() {
  return {
    firstName: 'John',
    lastName: 'Doe'
  }
}

},{}]},{},[1])

return sectionExports; });