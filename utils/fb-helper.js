const fb = require('fb-messenger'); 
const format = require('string-format');


/**END */

module.exports.sendMessage = 
(id, message) => {
    var messenger = new fb(process.env.FB_PAGE_TOKEN);
    messenger.sendTextMessage(id, message)
}