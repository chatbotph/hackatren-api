const Message = require("../../../models/message"),
  Thread = require("../../../models/thread"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { decodeToken } = require("../../../utils/security"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendMessage } = require("../../../utils/fb-helper"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const createMessage = () => {
    const newMsg = new Message(req.body);
    return newMsg.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      console.log("here");
      let { thread, message } = await createMessage();
      const { order } = await Thread.findById(thread).populate({
        path: "order",
        select: "customer",
        populate: { path: "customer", select: "messenger_id" }
      });
      sendMessage(order.customer.messenger_id, message);

      sendData(res);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
