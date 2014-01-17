if (typeof global === 'undefined') { var global = window; } function requireSection (name, callback) { var names = Array.isArray(name) ? name : [name]; for (var i=0; i<names.length; i++) { names[i] = 'sections/' + names[i]; }  require(names, callback); }
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};// very simple event handler just to demonstrate global variable access among all modules
global.Bus = {
  handlers: [],
  trigger: function() {
    for (var i in this.handlers) {
      this.handlers[i].apply(global, arguments);
    }
  },
  addHandler: function(callback) {
    this.handlers.push(callback);
  }
}

var loaded = [],
    loadedSectionCallback = function(sectionName) {
      loaded.push(sectionName);
      document.getElementById('loadedSections').innerText = 'Loaded Sections: ' + loaded.join(', ');
    };
global.Bus.addHandler(loadedSectionCallback);
// add the base section right now because this code is within the base section
loadedSectionCallback('base');

requireSection(['section1'], function(module1Exports) {
  module1Exports.getUserInfo(function(user) {
    document.getElementById('hello').innerText = 'Hello ' + user.firstName + ' ' + user.lastName;
  });
});

},{}]},{},[1])