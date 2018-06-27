const ThreadSchema = require("../../../models/thread"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { client } = req.query;

  const Thread = ThreadSchema(client);

  const updateThread = () =>
    Thread.findByIdAndUpdate(_id, req.body).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const thread = await Thread.findById(_id);
      if (isNotExists(thread) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await updateThread();
        sendData(res, "Thread Updated");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
