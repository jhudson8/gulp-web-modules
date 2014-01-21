// module exports is returned when other modules "require" this module
module.exports = {
  getMessage: function(message) {
    // configuration values from /config/dev.json can be retrieved from global
    return global.config.message;
  }
}
