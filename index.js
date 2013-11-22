var config    = hexo.config.link_checker || false,
    isEnabled = config.enabled || false;

var linkCheckerOptions = {
  alias: 'lc',
  desc: 'Detects links that don\'t work, missing images and redirects.',
  usage: '<argument>',
  arguments: [
    {name: 'setup', desc: 'Initializes the storage file that will be used to store link data.'},
    {name: 'scan', desc: 'Starts the scanning process.'},
    {name: 'clean', desc: 'Removes all files created by this plugin.'},
    {name: 'reset', desc: 'Resets all storage files.'}
  ]
};

hexo.extend.console.register('link_checker', 'Detects links that don\'t work, missing images and redirects.', linkCheckerOptions, require('./command'));

hexo.extend.filter.register('post', function(data, callback) {
  if (!isEnabled) return callback(null, data);

  console.log(data);

  // return callback(null, data);
});