const Agent = require("../../../models/agent"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  console.log(req.query);
  const {
    pageSize = 40,
    page = 1,
    qUsername = "",
    qEmail = "",
    qContact = "",
    fields = ""
  } = req.query;

  const getAgents = () => {
    const textQuery = [];
    let query = {
      status: 1
    };
    if (qUsername !== "") {
      textQuery.push({
        name: new RegExp(`${qUsername}`, "i")
      });
    }
    if (qEmail !== "") {
      textQuery.push({
        address: new RegExp(`${qEmail}`, "i")
      });
    }
    if (qContact !== "") {
      textQuery.push({
        contact_no: new RegExp(`${qContact}`, "i")
      });
    }

    if (textQuery.length > 0) {
      query = {
        $and: textQuery,
        status: 1
      };
    }
    return Agent.count(query).catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const count = await getAgents();
      sendData(res, "", count, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
