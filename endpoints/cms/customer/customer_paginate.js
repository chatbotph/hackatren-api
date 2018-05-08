const Customer = require("../../../models/customer"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const {
    pageSize = 50,
    page = 1,
    qName = "",
    qAddress = "",
    qContact = ""
  } = req.query;

  const getCustomers = () => {
    const textQuery = [];
    if (qName !== "") {
      textQuery.push({
        name: new RegExp(`${qName}`, "ig")
      });
    }
    if (qAddress !== "") {
      textQuery.push({
        address: new RegExp(`${qAddress}`, "ig")
      });
    }
    if (qContact !== "") {
      textQuery.push({
        contact_no: new RegExp(`${qContact}`, "ig")
      });
    }
    let query = {
      $or: textQuery
    };
    return Customer.find({ status: 1 }, fields)
      .sort({ timestamp: -1 })
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize))
      .catch(err => {
        throw err;
      });
  };

  async function main() {
    try {
      const customers = await getCustomers();
      sendData(res, "", customers, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
