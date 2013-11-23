var BrokenLinkChecker = require('./core/brokenLinkChecker');

module.exports = function(data, callback) {
  var checker = new BrokenLinkChecker({
    'scope': BrokenLinkChecker.RUNNING_SCOPE_FILTER
  });

  if (!checker.getPluginConfig().enabled) return callback(null, data);

  checker.processRawData(data);

  return callback(null, data);
};