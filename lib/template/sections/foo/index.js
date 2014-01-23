// entry point for the "foo" module

// populate the section export with the "formatMessage" function
section.exports.formatMessage = function(message) {
  return require('./templates').foo({message: message});
};
