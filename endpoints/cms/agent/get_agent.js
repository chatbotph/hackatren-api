const Agent = require("../../../models/agent"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { fields } = req.query;

  const getById = () =>
    Agent.findById(_id, fields).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const agent = await Agent.findById(_id).catch(err => {
        throw err;
      });
      if (isNotExists(agent) === false) {
        sendData(res, "", agent, 200);
      } else {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
