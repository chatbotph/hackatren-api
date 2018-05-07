const Order = require("../../../models/order"),
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

  const removeOrder = () =>
    Order.findByIdAndRemove(_id).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const order = await Order.findById(_id);
      if (isNotExists(order) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await removeOrder();
        sendData(res, "Order deleted");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
