
module.exports.process = function(url) {
  var urlDecomposerRegex = /^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/,
      urlParts;

  // [0] - Original
  // [1] - Protocol
  // [2] - Hostname
  // [3] - Uri
  // [4] - Parameters
  // [5] - Hash
  urlParts = url.match(urlDecomposerRegex);

  // if !Protocol and !Hostname, it's an internal link
  // See
  //    - //www.youtube.com/  <- protocol aware link
  //    - /www.youtube.com/   <- relative url
  if (typeof urlParts[1] === 'undefined' && typeof urlParts[2] === 'undefined') {
    return;
  }

  return ((typeof urlParts[1] === 'undefined')? 'http:' : '')+urlParts[0]; // if does not have protocol (i.e. //www.youtube.com/)
};