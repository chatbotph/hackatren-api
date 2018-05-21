const Message = require("../../../models/message"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { decodeToken } = require("../../../utils/security"),
  { isNotExists } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { thread = "", fields = "" } = req.query;
  const { message } = req.body;

  let query;

  if (thread !== "") {
    query = { thread: ObjectId(thread) };
  }

  const getMessages = () =>
    Message.find(query, fields).catch(err => {
      throw err;
    });

  async function main() {
    try {
      let messages = await getMessages();
      sendData(res, "", messages);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
