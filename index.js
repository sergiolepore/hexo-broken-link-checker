var packageInfo = require('./package');

var linkCheckerOptions = {
  alias: 'lc',
  desc: packageInfo.description,
  usage: '<argument>',
  arguments: [
    {name: 'setup', desc: 'Initializes the storage file that will be used to store link data.'},
    {name: 'scan', desc: 'Starts the scanning process.'},
    {name: 'clear', desc: 'Removes all files created by this plugin.'},
    {name: 'clean-logs', desc: 'Removes only the log files created by this plugin.'},
    {name: 'reset', desc: 'Resets all storage files.'},
    {name: 'info', desc: 'Displays useful info, like plugin version, author or GitHub links'}
  ]
};

// register command handler
hexo.extend.console.register('link_checker', packageInfo.description, linkCheckerOptions, require('./lib/command'));

// register filter handler
hexo.extend.filter.register('post', require('./lib/filter'));