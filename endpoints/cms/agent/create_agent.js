const Agent = require("../../../models/agent"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { gateWayRequestUrl } = require("../../../utils/gateway"),
  axios = require("axios");

module.exports = (req, res, next) => {
  const { username, email } = req.body;
  const token = req.headers["authorization-token"];

  const checkExisting = () =>
    Agent.findOne({
      $or: [{ username }, { email }]
    }).catch(err => {
      throw err;
    });

  const createAgent = () => {
    const { email, username, name, contact_no, permission } = req.body;
    const newAgent = new Agent({
      email,
      username,
      name,
      contact_no,
      permission
    });
    return newAgent.save().catch(err => {
      throw err;
    });
  };

  const createMasterDBAgent = () => {
    const { username, password, permission, name } = req.body;
    axios(gateWayRequestUrl("credential"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token
      },
      data: { username, password, permission, name }
    });
  };

  async function main() {
    try {
      const check = await checkExisting();
      if (isNotExists(check) === true) {
        await createAgent();
        await createMasterDBAgent();
        sendData(res, "Resource Created", "", 201);
      } else {
        sendError(res, CONFILCT_ERROR, CONFLICT_MSG);
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
