const Order = require("../../../models/order"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { order_no } = req.params;

  const updateOrder = () => {
    let query = order_no
      ? {
          order_no,
          status: 1
        }
      : { status: 1, _id: ObjectId(_id) };
    return Order.findOneAndUpdate(query, req.body).catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const order = await Order.findById(_id);
      if (isNotExists(order) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await updateOrder();
        sendData(res, "Order Updated");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
