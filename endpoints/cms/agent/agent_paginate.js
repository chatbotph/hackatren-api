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
    qName = "",
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
    if (qName !== "") {
      textQuery.push({
        $or: [
          { "name.first": new RegExp(`${qName}`, "i") },
          { "name.last": new RegExp(`${qName}`, "i") }
        ]
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
    return Agent.find(query, fields)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .catch(err => {
        throw err;
      });
  };

  async function main() {
    try {
      const agents = await getAgents();
      sendData(res, "", agents, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
