var BrokenLinkChecker = require('./brokenLinkChecker'),
    packageInfo       = require('./package.json');

function BrokenLinkCheckerCommands(args, callback) {
  console.log('\n  ______           _                _     _       _      _____ _               _'.yellow);
  console.log('  | ___ \\         | |              | |   (_)     | |    /  __ \\ |             | |'.yellow);
  console.log('  | |_/ /_ __ ___ | | _____ _ __   | |    _ _ __ | | __ | /  \\/ |__   ___  ___| | _____ _ __ '.yellow);
  console.log('  | ___ \\ \'__/ _ \\| |/ / _ \\ \'_ \\  | |   | | \'_ \\| |/ / | |   | \'_ \\ / _ \\/ __| |/ / _ \\ \'__|'.yellow);
  console.log('  | |_/ / | | (_) |   <  __/ | | | | |___| | | | |   <  | \\__/\\ | | |  __/ (__|   <  __/ |   '.yellow);
  console.log('  \\____/|_|  \\___/|_|\\_\\___|_| |_| \\_____/_|_| |_|_|\\_\\  \\____/_| |_|\\___|\\___|_|\\_\\___|_|   \n'.yellow);
  console.log('  ... For Hexo blogs :3'.yellow);
  console.log('\n');

  var opt = args._[0] || null;
  var checker = new BrokenLinkChecker();

  switch (opt) {
    case 'setup':
      checker.setup();
      break;
    case 'scan':
      checker.addLinkSchema({"url": "http://wixa.com"});
      // request('http://www.siempregeek.com.ar/', function(error, response, body) {
      //   if (error) return console.error(('[ERROR] Link error.').red);

      //   console.log(response.request.redirects);
      // });
      // emojiCommands.remove(); // remove emojis
      break;
    case 'clean':
      checker.clean();
      break;
    case 'reset':
      checker.clean();
      checker.setup();
      break;
    case 'info':
      BrokenLinkCheckerCommands.showInfo();
      break;
    default:
      hexo.call('help', {_: ['link_checker']}, callback);
  }
}

BrokenLinkCheckerCommands.showInfo = function() {
  console.log('\\|°▿▿▿▿°|/ hey there!\n');
  console.log('Version'.bold+': '+packageInfo.version);
  console.log('Author'.bold+':  '+packageInfo.author.name+' <'+packageInfo.author.email+'>');
  console.log('Website'.bold+': '+packageInfo.author.url);
  console.log('Help'.bold+':    hexo help link_checker');
  console.log('Github'.bold+':  '+packageInfo.repository.url);
  console.log('Bugs'.bold+':    '+packageInfo.bugs.url);
  console.log('\nThank you so much for using it!\n');
};

module.exports = BrokenLinkCheckerCommands;