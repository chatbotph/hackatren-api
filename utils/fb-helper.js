const fb = require("fb-messenger");

const { Messenger } = require("fbmessenger");

/**END */

module.exports.sendMessage = (id, text, client) => {
  // var messenger = new fb(process.env.FB_ACCESS_TOKEN);
  
  let token;
  if(client ==="jollibee"){
    token = process.env.JOLLIBEE_PAGE_TOKEN
  } else{
    token = process.env.BONCHON_PAGE_TOKEN
  }
  console.log(id);
  const messenger = new Messenger({
    pageAccessToken: token
  });
  // messenger.sendTextMessage(id, message, (err, body) => {
  //   if (err) return console.error(err);
  // });
  messenger
    .send({ text }, id)
    .then(res => console.log(res))
    .catch(err => console.log(err));
};
