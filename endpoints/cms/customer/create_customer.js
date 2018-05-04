const Customer = require("../../../models/customer"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers");

module.exports = (req, res, next) => {
  const { name, messenger_id } = req.body;

  const checkExisting = () =>
    Customer.findOne({ messenger_id, status: 1 }).catch(err => {
      throw err;
    });

  const createCustomer = () => {
    const newCustomer = new Customer(req.body);
    return newCustomer.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const check = await checkExisting();
      if (isNotExists(check) === true) {
        await createCustomer();
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
