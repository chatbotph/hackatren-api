const Message = require("../../../models/message"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { thread = "", status = "" } = req.query;
  let query = {};

  if (thread !== "") {
    query["thread"] = ObjectId(thread);
  }
  if (status !== "") {
    query["status"] = Number(status);
  }
  async function main() {
    try {
      let count = await Message.find(query).count();
      sendData(res, "", count);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
