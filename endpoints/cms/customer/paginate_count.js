const Customer = require("../../../models/customer"),
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
    qAddress = "",
    qContact = "",
    fields = ""
  } = req.query;

  const getCustomers = () => {
    const textQuery = [];
    let query = {
      status: 1
    };
    if (qName !== "") {
      textQuery.push({
        name: new RegExp(`${qName}`, "i")
      });
    }
    if (qAddress !== "") {
      textQuery.push({
        address: new RegExp(`${qAddress}`, "i")
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
    console.log(query);
    return Customer.count(query).catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const count = await getCustomers();
      sendData(res, "", count, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
