var wrench  = require('wrench'),
    colors  = require('colors'),
    Logger  = require('../util/logger'),
    fs      = require('fs'),
    userConfig  = hexo.config.link_checker || false,
    jsonfile    = require('jsonfile'),
    JSONSelect  = require('JSONSelect'),
    HtmlParser  = require('../util/htmlParser'),
    LinkChecker = require('../util/linkChecker'),
    _s = require('underscore.string');

function BrokenLinkChecker(options) {
  this.runningScope = options.scope || BrokenLinkChecker.RUNNING_SCOPE_COMMAND;
  this.pluginConfig = {};
  this.pluginConfig.enabled = userConfig.enabled || true;
  this.pluginConfig.storageDir = userConfig.storage_dir || 'temp/link_checker';
  this.pluginConfig.silentLogs = options.silentLogs || userConfig.silent_logs || false;

  this.workingDirectory = hexo.base_dir + this.pluginConfig.storageDir;

  if (this.workingDirectory.substr(-1) != '/') {
    this.workingDirectory += '/';
  }

  this.storageFile = 'data.json';
  this.logFile = 'broken_link_checker.log';
  this._storageTemplateFile = __dirname + '/../data/storageTemplate.json';
  this._jsonStorage = null;

  var loggerOptions = {
    defaultPrefix: null,
    infoPrefix: null,
    warnPrefix: null,
    errPrefix: null,
    silent: this.pluginConfig.silentLogs,
    logFile: this.workingDirectory+this.logFile
  };

  switch (this.runningScope) {
    case BrokenLinkChecker.RUNNING_SCOPE_COMMAND:
      loggerOptions.defaultPrefix = '(i) '.cyan;
      loggerOptions.warnPrefix = '(!) '.yellow;
      loggerOptions.errPrefix = '(x) '.red;
      break;
    case BrokenLinkChecker.RUNNING_SCOPE_FILTER:
      loggerOptions.defaultPrefix = '['+(this.toString()+' Info').cyan+'] ';
      loggerOptions.warnPrefix = '['+(this.toString()+' Warning').yellow+'] ';
      loggerOptions.errPrefix = '['+(this.toString()+' Error').red+'] ';
      break;
  }

  this.logger = new Logger(loggerOptions);
}

module.exports = BrokenLinkChecker;

BrokenLinkChecker.RUNNING_SCOPE_COMMAND = 1;
BrokenLinkChecker.RUNNING_SCOPE_FILTER = 2;

BrokenLinkChecker.prototype.toString = function() {
  return 'BrokenLinkChecker';
};

BrokenLinkChecker.prototype.getRunningScope = function() {
  return this.runningScope;
};

BrokenLinkChecker.prototype.getLogger = function() {
  return this.logger;
};

BrokenLinkChecker.prototype.getPluginConfig = function() {
  return this.pluginConfig;
};

BrokenLinkChecker.prototype.getWorkingDirectory = function() {
  return this.workingDirectory;
};

BrokenLinkChecker.prototype.getStorageFile = function() {
  return this.storageFile;
};

BrokenLinkChecker.prototype.getStorageFilename = function() {
  var path = this.workingDirectory;

  return path + this.storageFile;
};

BrokenLinkChecker.prototype.getJSONStorage = function(refresh) {
  refresh = refresh || false;

  if (!fs.readFileSync(this.getStorageFilename())) return;

  if (!this._jsonStorage || refresh) this._jsonStorage = jsonfile.readFileSync(this.getStorageFilename());
  
  return this._jsonStorage;
};

BrokenLinkChecker.prototype.persistJSONStorage = function() {
  var destFile = this.getStorageFilename();

  jsonfile.writeFileSync(destFile, this._jsonStorage);
};

BrokenLinkChecker.prototype.setup = function() {
  var logger = this.getLogger(),
      statMode = 0777,
      storageSourceFile,
      storageDestFile,
      storageSourceContents;
  
  logger.info('Creating working directory: %s', [this.workingDirectory.inverse]);

  if (!fs.existsSync(this.workingDirectory)) {
    wrench.mkdirSyncRecursive(this.workingDirectory, statMode);
  } else {
    logger.warning('The directory already exists.');
  }

  logger.info('Generating storage file: %s', [this.storageFile.inverse]);

  storageSourceFile = this._storageTemplateFile;
  storageDestFile = this.getStorageFilename();

  if (!fs.existsSync(storageDestFile)) {
    storageSourceContents = fs.readFileSync(storageSourceFile);
    fs.writeFileSync(storageDestFile, storageSourceContents);
  } else {
    logger.warning('The storage file %s\n   already exists and will not be overwritten.\n   If you are %s, you can run this command with the %s argument.', [storageDestFile.yellow.inverse, 'COMPLETELY SURE'.underline, 'reset'.inverse]);
  }

  // reset stat mode
  logger.info('Applying write permissions to storage file.');
  fs.chmodSync(storageDestFile, statMode);

  logger.info('Generating log file: %s', [logger.logFile.inverse]);
  logger.createLogs();

  logger.info('Done.\n');
};

BrokenLinkChecker.prototype.clear = function() {
  var logger = this.getLogger(),
      target = this.workingDirectory;

  logger.info('Removing all files in %s', [target.inverse]);

  if (fs.existsSync(target)) {
    wrench.rmdirSyncRecursive(target, function() {
      logger.warning('There was an error removing %s directory. Please, remove it manually.', [target.inverse]);
    });
  }

  logger.info('Done.\n');
};

BrokenLinkChecker.prototype.cleanLogs = function() {
  var logger = this.getLogger();

  logger.info('Regenerating log file: %s', [logger.logFile.inverse]);
  logger.cleanLogs();
  logger.info('Done.\n');
};

BrokenLinkChecker.prototype.storeLink = function(jsonSchema) {
  var logger = this.getLogger(),
      url = jsonSchema.url || false,
      storageFile,
      query,
      matches;

  if (!url) {
    logger.error('Invalid JSON schema.', true);

    return false;
  }

  storageFile = this.getJSONStorage();
  query = ':has(:root > .url:val("'+url+'"))';
  matches = JSONSelect.match(query, storageFile);

  if (matches.length) {
    logger.warning('Schema for URL %s already exists.', [url.inverse], true);

    return false;
  }

  this._jsonStorage.links.push(jsonSchema);
  this.persistJSONStorage();

  return true;
};

BrokenLinkChecker.prototype.processRawData = function(postData) {
  var logger = this.getLogger(),
      urlSchemaArr = Array(),
      ignoredCount = 0,
      htmlParser,
      operationStatus;

  logger.info('Extracting links from %s', [postData.source.inverse]);
  
  htmlParser = new HtmlParser(postData);
  urlSchemaArr = urlSchemaArr.concat(htmlParser.processATags());
  urlSchemaArr = urlSchemaArr.concat(htmlParser.processImgTags());
  urlSchemaArr = urlSchemaArr.concat(htmlParser.processYouTube());

  logger.info('Trying to persist %d links to storage.', [urlSchemaArr.length]);

  for (var i=0;i<urlSchemaArr.length;i++) {
    operationStatus = this.storeLink(urlSchemaArr[i]);

    if (!operationStatus) ignoredCount++;
  }

  if (ignoredCount > 0) {
    logger.warning('%d links have been ignored. They could be duplicates or wrong data.', [ignoredCount]);
  }

  logger.info('Done.');
};

BrokenLinkChecker.prototype.checkLinks = function() {
  var storageFile = this.getJSONStorage(),
      logger = this.getLogger(),
      _this = this,
      checker;

  logger.info('Scanning links...');
  
  checker = new LinkChecker(storageFile.links);
  checker.start(function(err, links) {
    logger.info('Processed %d links in %s seconds.', [links.length, checker.getSpentTime()]);

    _this._jsonStorage.links = links;
    _this.persistJSONStorage();
  }, function(url) {
    logger.info('Checking %s', [url]);
  });
};