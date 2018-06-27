const CustomerSchema = require("../../../models/customer"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { client } = req.query;
  const Customer = CustomerSchema(client);

  const updateCustomerById = () =>
    Customer.findByIdAndUpdate(_id, req.body).catch(err => {
      throw err;
    });

  const updateCustomerByMessengerId = () =>
    Customer.findOneAndUpdate({ messenger_id: _id }, req.body).catch(err => {
      throw err;
    });

  async function main() {
    try {
      try {
        const byId = await Customer.findById(_id);
        if (isNotExists(byId) == true) {
          sendError(res, NOT_FOUND, NOT_FOUND_MSG);
        } else {
          await updateCustomerById();
          sendData(res, "Customer Updated");
        }
      } catch (error) {
        const byMessengerId = await Customer.findOne({ messenger_id: _id });
        if (isNotExists(byMessengerId) == true) {
          sendError(res, NOT_FOUND, NOT_FOUND_MSG);
        } else {
          await updateCustomerByMessengerId();
          sendData(res, "Customer Updated");
        }
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
