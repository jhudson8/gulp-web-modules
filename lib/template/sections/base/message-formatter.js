module.exports = {
  getMessage: function(message) {
    // configuration values from /config/dev.json can be retrieved from global
    return global.config.message;
  }
}