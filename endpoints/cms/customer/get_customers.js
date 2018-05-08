const Customer = require("../../../models/customer"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { fields } = req.query;
  const getCustomers = () =>
    Customer.find({ status: 1 }, fields)
      .sort({ timestamp: -1 })
      .catch(err => {
        throw err;
      });

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
