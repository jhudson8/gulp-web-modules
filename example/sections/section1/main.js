global.Bus.trigger('section1');

section.exports.getUserInfo = function(callback) {
  requireSection('section2', function(sectionExports) {
    callback(sectionExports.user);
  });  
}
