var prettyjson  = require('prettyjson'),
    updateNotifier = require('update-notifier'),
    packageInfo = require('../package.json'),
    BrokenLinkChecker = require('./core/brokenLinkChecker');

function BrokenLinkCheckerCommands(args, callback) {
  var opt = args._[0] || null,
      update = (typeof args.update === 'undefined')? true : args.update,
      notifier,
      checker;
  
  console.log('\n  ______           _                _     _       _      _____ _               _'.yellow);
  console.log('  | ___ \\         | |              | |   (_)     | |    /  __ \\ |             | |'.yellow);
  console.log('  | |_/ /_ __ ___ | | _____ _ __   | |    _ _ __ | | __ | /  \\/ |__   ___  ___| | _____ _ __ '.yellow);
  console.log('  | ___ \\ \'__/ _ \\| |/ / _ \\ \'_ \\  | |   | | \'_ \\| |/ / | |   | \'_ \\ / _ \\/ __| |/ / _ \\ \'__|'.yellow);
  console.log('  | |_/ / | | (_) |   <  __/ | | | | |___| | | | |   <  | \\__/\\ | | |  __/ (__|   <  __/ |   '.yellow);
  console.log('  \\____/|_|  \\___/|_|\\_\\___|_| |_| \\_____/_|_| |_|_|\\_\\  \\____/_| |_|\\___|\\___|_|\\_\\___|_|   \n'.yellow);
  console.log('  ... For Hexo blogs :3'.yellow);
  console.log('\n');
  
  if (update) {
    notifier = new updateNotifier({
      packagePath: '../package.json'
    });

    if (notifier.update) {
      console.log('---------------------------------------------------------------------------------------------'.bold.cyan);
      console.log('  Update available: %s %s'.bold, notifier.update.latest.yellow, ('(current: '+notifier.update.current+')').grey);
      console.log('  Run %s to update'.bold, ('npm update '+notifier.update.name).magenta);
      console.log('---------------------------------------------------------------------------------------------\n'.bold.cyan);
    }
  }

  checker = new BrokenLinkChecker({
    'scope': BrokenLinkChecker.RUNNING_SCOPE_COMMAND
  });

  switch (opt) {
    case 'setup':
      checker.setup();
      break;
    case 'scan':
      checker.checkLinks();
      break;
    case 'clear':
      checker.clear();
      break;
    case 'clean-logs':
      checker.cleanLogs();
      break;
    case 'reset':
      checker.clear();
      checker.setup();
      break;
    case 'config':
      BrokenLinkCheckerCommands.dumpConfig();
      break;
    case 'info':
      BrokenLinkCheckerCommands.showInfo();
      break;
    case 'show-links':
      var linkFilter = args.filter,
          linkFilterId = args.id,
          selectedFilter;

      if (!linkFilterId) {
        switch (linkFilter) {
          case 'all':
            selectedFilter = BrokenLinkChecker.LIST_LINKS_FILTER_ALL;
            break;
          case 'broken':
            selectedFilter = BrokenLinkChecker.LIST_LINKS_FILTER_BROKEN;
            break;
          case 'redirects':
            selectedFilter = BrokenLinkChecker.LIST_LINKS_FILTER_REDIRECTS;
            break;
          default:
            selectedFilter = BrokenLinkChecker.LIST_LINKS_FILTER_ALL;
        }

        checker.listLinkStorage(selectedFilter);
      } else {
        checker.listLinkById(linkFilterId);
      }
      break;
    case 'show-logs':
      var logFilter = args.filter || false;

      checker.listLogs(logFilter);
      break;
    default:
      hexo.call('help', {_: ['link_checker']}, callback);
  }
}

BrokenLinkCheckerCommands.dumpConfig = function() {
  var checker = new BrokenLinkChecker({
    'scope': BrokenLinkChecker.RUNNING_SCOPE_COMMAND
  });

  var colorTheme = {
    keysColor: 'yellow',
    dashColor: 'yellow',
    stringColor: 'white'
  };

  console.log('User configuration:'.bold);
  console.log(prettyjson.render(checker.getPluginConfig(), colorTheme) + '\n');
};

BrokenLinkCheckerCommands.showInfo = function() {
  console.log('\\|°▿▿▿▿°|/ hey there!\n');
  
  console.log('Version'.bold+': '+packageInfo.version);
  console.log('Author'.bold+':  '+packageInfo.author.name+' <'+packageInfo.author.email+'>');
  console.log('Website'.bold+': '+packageInfo.author.url);
  console.log('Help'.bold+':    hexo help link_checker');
  console.log('Github'.bold+':  '+packageInfo.repository.url);
  console.log('Bugs'.bold+':    '+packageInfo.bugs.url);
  
  console.log('\nColor Reference:'.bold);
  console.log('  This'.cyan+' means info; e.g., "'+'(i)'.cyan+' You are reading this."');
  console.log('  This'.yellow+' means warning; e.g., "'+'(!)'.yellow+' This is the Production server."');
  console.log('  This'.red+' means error; e.g., "'+'(x)'.red+' All tests failed."');

  console.log('\nThank you so much for using it!\n');
};

module.exports = BrokenLinkCheckerCommands;