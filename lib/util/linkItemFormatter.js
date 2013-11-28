var colors = require('colors'),
    moment = require('moment');

module.exports = function(item) {
  var itemStatus,
      itemLastCheck,
      itemLinkText;

  if (!item.lastChecked) {
    itemStatus = 'Unverified'.yellow;
  } else if (item.lastChecked && item.success) {
    itemStatus = 'Ok'.green;
  } else {
    itemStatus = 'Broken'.red;
  }

  if (item.lastChecked) {
    itemLastCheck = moment(item.lastChecked).format('YYYY-MM-DD HH:mm:ss');
  } else {
    itemLastCheck = 'Never';
  }

  switch (item.link.type) {
    case 'Text':
      itemLinkText = item.link.label;
      break;
    case 'Image':
      itemLinkText = item.link.type;
      break;
    case 'YouTube':
      itemLinkText = item.link.type;
      break;
  }

  item.lastChecked = itemLastCheck;
  item.status = itemStatus;
  item.link.text = itemLinkText;

  return item;
};