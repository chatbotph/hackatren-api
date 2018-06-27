const MessageSchema = require("../../../models/message"),
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
  const {
    thread = "",
    fields = "",
    paginate = "",
    page = 1,
    pageSize = 10,
    client
  } = req.query;

  const Message = MessageSchema(client);

  let query;

  if (thread !== "") {
    query = { thread: ObjectId(thread) };
  }

  const paginateMessages = () =>
    Message.find(query)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize));

  const getMessages = () => {
    if (paginate === "") {
      return Message.find(query, fields).catch(err => {
        throw err;
      });
    }
    return paginateMessages();
  };

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
