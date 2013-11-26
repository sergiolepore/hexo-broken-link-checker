var removeColors = require('./ansiStripper'),
    jsonfile = require('jsonfile'),
    moment = require('moment'),
    fs = require('fs'),
    _s = require('underscore.string');

function Logger(options) {
  this._defaultPrefix = options.defaultPrefix || '';
  this._infoPrefix = options.infoPrefix || this._defaultPrefix;
  this._warnPrefix = options.warnPrefix || this._defaultPrefix;
  this._errPrefix = options.errPrefix || this._defaultPrefix;
  this._silent = options.silent || false; // silent saves log data on file system, instead of console.log'em.
  this.logFilename = options.logFile || false;
  this._logFile = null;
}

Logger.prototype.getLogFile = function(refresh) {
  refresh = refresh || false;

  if (!fs.readFileSync(this.logFilename)) return;

  if (!this._logFile || refresh) this._logFile = jsonfile.readFileSync(this.logFilename);
  
  return this._logFile;
};

Logger.prototype.persistLog = function() {
  jsonfile.writeFileSync(this.logFilename, this._logFile);
};

Logger.prototype.addToLogFile = function(json) {
  logFile = this.getLogFile();
  logFile.logs.push(json);
  this._logFile = logFile;
};

Logger.prototype.info = function() {
  this._outputData(arguments, 'info');
};

Logger.prototype.error = function() {
  this._outputData(arguments, 'err');
};

Logger.prototype.warning = function() {
  this._outputData(arguments, 'warn');
};

Logger.prototype._outputData = function(args, type) {
  var datetime,
      prefix,
      data,
      forceSilent,
      sprintfVars,
      logSchema;

  data = args[0];

  if (args[1] instanceof Array) {
    sprintfVars = args[1];

    data = _s.vsprintf(data, sprintfVars);

    if (typeof args[2] === 'boolean') {
      forceSilent = args[2];
    }
  } else if (typeof args[1] === 'boolean') {
    forceSilent = args[1];
  }

  if (this._silent || forceSilent) {
    if (!this.logFilename) throw new Error('logFile option not provided.');
    if (!fs.existsSync(this.logFilename)) {
      // throw new Error('logFile does not exists. Run `createLogs`.');
      console.warn('logFile does not exists. Run `createLogs`.');
      return;
    }

    datetime = moment();
    data = removeColors(data);

    logSchema = {};
    logSchema.date = datetime;
    logSchema.type = type;
    logSchema.data = data;

    this.addToLogFile(logSchema);
    this.persistLog();

    // fs.appendFileSync(this.logFilename, data);
  } else {
    prefix = this[_s.sprintf('_%sPrefix', type)];

    switch (type) {
      case 'info':
        console.log(prefix+data);
        break;
      case 'warn':
        console.warn(prefix+data);
        break;
      case 'err':
        console.error(prefix+data);
        break;
    }
  }
};

Logger.prototype.createLogs = function() {
  if (fs.existsSync(this.logFilename)) return;

  var logSchema = {
    logs: []
  };

  fs.writeFileSync(this.logFilename, '');
  fs.chmodSync(this.logFilename, 0777);

  this._logFile = logSchema;
  this.persistLog();
};

Logger.prototype.cleanLogs = function() {
  if (fs.existsSync(this.logFilename)) {
    fs.unlinkSync(this.logFilename);
  }

  this.createLogs();
};

module.exports = Logger;