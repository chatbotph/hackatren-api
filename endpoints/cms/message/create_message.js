const MessageSchema = require("../../../models/message"),
  ThreadSchema = require("../../../models/thread"),
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
  const {
    data: { _id, permission }
  } = decodeToken(req.headers["authorization-token"]);

  const { client } = req.query;
  const Message = MessageSchema(client);
  const Thread = ThreadSchema(client);

  const createMessage = () => {
    const newMsg = new Message(req.body);
    return newMsg.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      let {
        thread,
        type,
        message,
        status,
        timestamp,
        _id
      } = await createMessage();
      const { order } = await Thread.findById(thread).populate({
        path: "order",
        select: "customer order_no",
        populate: { path: "customer", select: "messenger_id" }
      });
      sendMessage(order.customer.messenger_id, message);

      req.payload = {
        message: { thread, type, message, status, timestamp, _id },
        order_no: order.order_no,
        senderId: permission === "agent" ? _id : `${_id}_ADMIN`
      };

      next();
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
