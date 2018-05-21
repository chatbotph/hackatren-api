const Thread = require("../../../models/thread"),
  Message = require("../../../models/message"),
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
  const {
    data: { _id }
  } = decodeToken(req.headers["authorization-token"]);
  const { name } = req.body;

  const createThread = () => {
    let { thread } = req.body;
    thread = Object.assign({ agent: ObjectId(_id) }, thread);
    const newThread = new Thread(thread);
    return newThread.save().catch(err => {
      throw err;
    });
  };

  const newMessage = threadId => {
    let { message } = req.body;
    message = Object.assign({ thread: ObjectId(threadId) }, message);
    const newMessage = new Message(message);
    return newMessage.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      let thread = await createThread(),
        message = await newMessage(thread._id);

      thread = await Thread.findById(
        thread._id,
        "order last_activity"
      ).populate({
        path: "order",
        select: " customer order_no",
        populate: { path: "customer", select: "name" }
      });

      req.payload = {
        thread,
        agent: _id
      };
      next();
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
