var Cheerio   = require('cheerio'),
    JsonFile  = require('jsonfile'),
    UrlUtil   = require('./url');

function HtmlParser(postData) {
  this.postData = postData;
  this._linkSchema = JsonFile.readFileSync(__dirname+'/../data/linkSchema.json');
  this.$ = Cheerio.load(postData.content);
}

module.exports = HtmlParser;

HtmlParser.prototype.getLinkSchemaTemplate = function() {
  return JSON.parse(JSON.stringify(this._linkSchema));
};

HtmlParser.prototype.processTag = function(querySelector, linkType, urlSelectorCb, labelSelectorCB) {
  var linkContainer = Array(),
      _this = this;

  this.$(querySelector).each(function() {
    var elementUrl,
        linkSchema;

    elementUrl = UrlUtil.process(urlSelectorCb(this));

    if (!elementUrl) return;

    linkSchema = _this.getLinkSchemaTemplate();
    linkSchema.url = elementUrl;
    linkSchema.link.type = linkType;
    linkSchema.link.label = labelSelectorCB(this);
    linkSchema.source.title = _this.postData.title;
    linkSchema.source.file = _this.postData.source;

    linkContainer.push(linkSchema);
  });

  return linkContainer;
};

HtmlParser.prototype.processATags = function() {
  var $ = this.$;

  return this.processTag('a', 'Text', function(elem) {
    return $(elem).attr('href');
  }, function(elem) {
    return $(elem).text();
  });
};

HtmlParser.prototype.processImgTags = function() {
  var $ = this.$;

  return this.processTag('img', 'Image', function(elem) {
    return $(elem).attr('src');
  }, function(elem) {
    var alt,
        title,
        returnStr;

    alt = $(elem).attr('alt');
    title = $(elem).attr('title');

    returnStr = alt || title || '';

    return returnStr;
  });
};

HtmlParser.prototype.processYouTube = function() {
  var $ = this.$;

  return this.processTag('iframe[src*="youtube.com"]', 'YouTube', function(elem) {
    return $(elem).attr('src');
  }, function(elem) {
    return 'YouTube Video';
  });
};