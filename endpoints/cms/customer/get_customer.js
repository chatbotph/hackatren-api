const Customer = require("../../../models/customer"),
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
  const { fields, messenger_id = "" } = req.query;

  const getCustomer = () => {
    let query = { _id: ObjectId(_id), status: 1 };
    if (messenger_id !== "") {
      let query = { messenger_id, status: 1 };
    }
    return Customer.findOne(query, fields).catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const customer = await getCustomer();
      if (isNotExists(customer) === false) {
        sendData(res, "", customer, 200);
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
