const Order = require("../../../models/order"),
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
  const { fields, order_no } = req.query;

  const getOrder = () => {
    let query = order_no
      ? {
          order_no,
          status: 1
        }
      : { status: 1, _id: ObjectId(_id) };

    return Order.findOne(query, fields)
      .populate({ path: "customer items", select: "name price" })
      .catch(err => {
        throw err;
      });
  };

  async function main() {
    try {
      const order = await getOrder();
      if (isNotExists(order) === false) {
        sendData(res, "", order, 200);
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
