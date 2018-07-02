const MessageSchema = require("../../../models/message"),
  ThreadSchema = require("../../../models/thread"),
  OrderSchema = require("../../../models/order"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR, NOT_FOUND },
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
  const Order = OrderSchema(client);

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
      const checkThread = await Thread.findById(thread).populate({
        path: "order",
        select: "customer",
        populate: { path: "customer agent", select: "messenger_id" }
      });
      if (checkThread) {
        const { order } = checkThread;

        sendMessage(order.customer.messenger_id, message, client);

        const { agent } = await Order.findById(order._id, "agent");
        console.log("order agent", agent);

        req.payload = {
          message: { thread, type, message, status, timestamp, _id },
          order_no: order.order_no,
          agent: agent._id
        };
        req.org = client;
        next();
      } else {
        sendError(
          res,
          NOT_FOUND,
          "We cannot find this thread. It has been either deleted or removed from the active threads"
        );
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
