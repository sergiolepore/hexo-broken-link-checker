var request = require('request'),
    wrench  = require('wrench'),
    colors  = require('colors'),
    config  = hexo.config.link_checker || false,
    fs      = require('fs'),
    jsonfile = require('jsonfile'),
    JSONSelect = require('JSONSelect');

function BrokenLinkChecker() {
  var configuredDir = config.storage_dir || 'temp/link_checker';
  this.workingDirectory = hexo.base_dir + configuredDir;
  this.storageFile = 'data.json';
  this._storageTemplateFile = __dirname + '/storageTemplate.json';
  this._jsonStorage = null;
}

module.exports = BrokenLinkChecker;

BrokenLinkChecker.prototype.getWorkingDirectory = function() {
  return this.workingDirectory;
};

BrokenLinkChecker.prototype.getStorageFile = function() {
  return this.storageFile;
};

BrokenLinkChecker.prototype.getStorageFilename = function() {
  var path = this.workingDirectory;

  if (path.substr(-1) != '/') {
    path += '/';
  }

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
  console.log('>> Creating working directory: '+this.workingDirectory.inverse);

  var statMode = 0777;

  if (!fs.existsSync(this.workingDirectory)) {
    wrench.mkdirSyncRecursive(this.workingDirectory, statMode);
    console.log('>> Done.');
  } else {
    console.warn('!! The directory already exists.');
  }

  console.log('>> Generating storage file: '+this.storageFile.inverse);

  var srcFile = this._storageTemplateFile;
  var destFile = this.getStorageFilename();

  if (!fs.existsSync(destFile)) {
    var contents = fs.readFileSync(srcFile);
    fs.writeFileSync(destFile, contents);
  } else {
    console.warn('!! The storage file '+destFile.yellow.inverse+'\n   already exists and will not be overwritten.\n   If you need it, you can run this command with the '+'reset'.inverse+' argument.');
  }

  // reset stat mode
  console.log('>> Applying write permissions to storage file.');
  fs.chmodSync(destFile, statMode);

  console.log('>> Done.\n');
};

BrokenLinkChecker.prototype.clean = function() {
  var target = this.workingDirectory;

  console.log('>> Removing all files in '+target.inverse);

  if (fs.existsSync(target)) {
    wrench.rmdirSyncRecursive(target, function() {
      console.warn('!! There was an error removing '+target.inverse+' directory. Please, remove it manually.');
    });
  }

  console.log('>> Done.\n');
};

BrokenLinkChecker.prototype.getLinkSchemaTemplate = function() {
  var linkSchema = {
    "url": "",
    "lastChecked": "",
    "status": null,
    "redirects": null,
    "link": {
      "type": "",
      "label": ""
    },
    "source": {
      "title": "HTML5 - Infograf&iacute;a sobre su historia",
      "url": "http://www.sergiolepore.net/2012-07-28-html5-infografia-sobre-su-historia",
      "filename": "2012-07-28-html5-infografia-sobre-su-historia.markdown"
    }
  };

  return linkSchema;
};

BrokenLinkChecker.prototype.storeLink = function(jsonSchema) {
  var url = jsonSchema.url || false;

  if (!url) {
    console.warn('!! Invalid JSON schema.');

    return;
  }

  var storageFile = this.getJSONStorage();
  var query = ':has(:root > .url:val("'+url+'"))';
  var matches = JSONSelect.match(query, storageFile);

  if (matches.length) {
    console.warn('!! Schema for URL '+url.inverse+' already exists.');

    return;
  }

  this._jsonStorage.links.push(jsonSchema);
  this.persistJSONStorage();
};