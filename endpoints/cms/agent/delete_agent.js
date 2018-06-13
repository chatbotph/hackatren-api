const Agent = require("../../../models/agent"),
  {
    errs: { SERVER_ERROR, NOT_FOUND, CONFILCT_ERROR },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;

  const removeAgent = () =>
    Agent.findByIdAndRemove(_id, (err, agent) => {
      //fire remove hook
      agent.remove();
    }).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const agent = await Agent.findById(_id);
      if (isNotExists(agent) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await removeAgent();
        sendData(res, "Agent deleted");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
