var packageInfo = require('../package.json');

module.exports = {
  alias: 'lc',
  desc: packageInfo.description,
  usage: '<argument> [option]',
  arguments: [
    {name: 'setup', desc: 'Initializes the storage file that will be used to store link data.'},
    {name: 'scan', desc: 'Starts the scanning process.'},
    {name: 'clear', desc: 'Removes all files created by this plugin.'},
    {name: 'config', desc: 'Shows the plugin configuration.'},
    {name: 'clean-logs', desc: 'Removes only the log files created by this plugin.'},
    {name: 'reset', desc: 'Resets all storage files.'},
    {name: 'info', desc: 'Displays useful info, like plugin version, author or GitHub links'},
    {name: 'show-links', desc: 'Shows a table with ID, URL and status of all links.'},
    {name: 'show-logs', desc: 'Displays all log messages.'}
  ],
  options: [
    {name: '--no-update', desc: 'Prevent the automatic update checker and notifier.'},
    {name: '--filter=[all|broken|ok|redirects|unverified]', desc: 'Only for \'show-links\' argument. Filter links by status.'},
    {name: '--id=[linkID]', desc: 'Only for \'show-links\' argument. Shows detailed info of a link.'}
  ]
};