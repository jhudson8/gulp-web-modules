// very simple event handler just to demonstrate global variable access among all modules
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

// show section that have been loaded to demonstrate all section access to global attributes
var loaded = [],
    loadedSectionCallback = function(sectionName) {
      loaded.push(sectionName);
      document.getElementById('loadedSections').innerText = 'Loaded Sections: ' + loaded.join(', ');
    };
global.Bus.addHandler(loadedSectionCallback);
// add the base section right now because this code is within the base section
loadedSectionCallback('base');

// async loading of another section
requireSection(['section1'], function(module1Exports) {
  module1Exports.getUserInfo(function(user) {
    document.getElementById('hello').innerText = 'Hello ' + user.firstName + ' ' + user.lastName;
  });
});

// demonstrate usage of external config parameter JSON file config/{build type}.json (injected into base module js)
document.getElementById('message').innerText = global.config.message