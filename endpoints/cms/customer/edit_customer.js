const Customer = require("../../../models/customer"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;

  const updateCustomer = () =>
    Customer.findByIdAndUpdate(_id, req.body).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const customer = await Customer.findById(_id);
      if (isNotExists(customer) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await updateCustomer();
        sendData(res, "Customer Updated");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
