const fb = require("fb-messenger");

const { Messenger } = require("fbmessenger");

/**END */

module.exports.sendMessage = (id, text) => {
  // var messenger = new fb(process.env.FB_ACCESS_TOKEN);
  const messenger = new Messenger({
    pageAccessToken: process.env.FB_ACCESS_TOKEN
  });
  // messenger.sendTextMessage(id, message, (err, body) => {
  //   if (err) return console.error(err);
  // });
  messenger
    .send({ text }, id)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};
