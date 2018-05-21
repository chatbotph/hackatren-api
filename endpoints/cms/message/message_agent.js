const Message = require("../../../models/message"),
  Thread = require("../../../models/thread"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { decodeToken } = require("../../../utils/security"),
  { isNotExists } = require("../../../utils/op-helpers"),
 
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { agent } = req.query;

  const createMessage = () => {
    const newMsg = new Message(
      Object.assign({ timestamp: Date.now() }, req.body)
    );
    return newMsg.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      let { type, message, status, timestamp, thread } = await createMessage();
      let { order } = await Thread.findById(thread, "order").populate({
        path: "order",
        select: "order_no"
      });

      req.payload = {
        message: {
          type,
          message,
          status,
          timestamp,
          thread
        },
        order_no: order.order_no,
        agent
      };
      next();
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
