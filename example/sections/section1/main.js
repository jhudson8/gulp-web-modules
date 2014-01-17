global.Bus.trigger('section1');

sectionExports.getUserInfo = function(callback) {
  requireSection('section2', function(sectionExports) {
    callback(sectionExports.user);
  });  
}
