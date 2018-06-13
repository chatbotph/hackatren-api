const Agent = require("../../../models/agent"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;

  const updateAgent = () =>
    Agent.findByIdAndUpdate(_id, req.body).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const check = await Agent.findById(_id);
      if (isNotExists(check) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await updateAgent();
        sendData(res, "Agent Updated");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
