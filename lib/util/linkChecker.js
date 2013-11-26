var request = require('request'),
    async = require('async'),
    moment = require('moment');

function LinkChecker(linkArray) {
  this.linkArray = linkArray;
  this.processedArray = Array();
  this._startTime = null;
  this._endTime = null;
}

module.exports = LinkChecker;

LinkChecker.prototype.getLinkArray = function() {
  return this.linkArray;
};

LinkChecker.prototype.getProcessedArray = function() {
  return this.processedArray;
};

LinkChecker.prototype.getSpentTime = function(humanReadable) {
  humanReadable = humanReadable || false;
  var timeFormat = 'seconds',
      spentTime;

  if (!this._startTime || !this._endTime) return;

  if (humanReadable) {
    spentTime = this._startTime.from(this._endTime, true);
  } else {
    spentTime = this._endTime.diff(this._startTime, timeFormat);
  }
  
  return spentTime;
};

LinkChecker.prototype.start = function(doneCallback, everyCallback) {
  var _this = this;

  this._endTime = null;
  this._startTime = moment();

  async.eachLimit(this.linkArray, 3, function(item, callback) {
    var url = item.url,
        currentTime = moment(),
        lastChecked = item.lastChecked;

    // only process links where lastChecked is 1 hour ago
    if (lastChecked && currentTime.diff(moment(lastChecked), 'seconds') < 3600) {
      _this.processedArray.push(item);
      callback();
      return;
    }

    if (everyCallback) everyCallback(url);

    item.lastChecked = currentTime;

    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        item.success = true;
      } else {
        item.success = false;
      }

      item.redirects = response.request.redirects;

      _this.processedArray.push(item);
      callback();
    });
  }, function(err) {
    _this._endTime = moment();
    doneCallback(err, _this.processedArray);
  });
};