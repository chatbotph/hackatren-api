const CustomerSchema = require("../../../models/customer"),
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
  const { client } = req.query;
  const Customer = CustomerSchema(client);

  const removeCustomer = () =>
    Customer.findByIdAndRemove(_id, (err, customer) => {
      customer.remove();
    }).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const customer = await Customer.findById(_id);
      if (isNotExists(customer) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await removeCustomer();
        sendData(res, "Cusomter deleted");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
