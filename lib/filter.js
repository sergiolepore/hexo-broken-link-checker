var BrokenLinkChecker = require('./core/brokenLinkChecker');

module.exports = function(data) {
  var checker = new BrokenLinkChecker({
    'scope': BrokenLinkChecker.RUNNING_SCOPE_FILTER
  });

  if (!checker.getPluginConfig().enabled) return data;

  checker.processRawData(data);

  return data;
};