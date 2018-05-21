const fb = require("fb-messenger");

/**END */

module.exports.sendMessage = (id, message) => {
  var messenger = new fb(process.env.FB_ACCESS_TOKEN);
  messenger.sendTextMessage(id, message);
};
