// module exports is returned when other modules "require" this module
module.exports = function(message) {
  // configuration values from /config/dev.json can be retrieved from global
  return message.toUpperCase();
}
