const Order = require("../../../models/order"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists, populateQuery } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { fields, order_no, populate = "" } = req.query;

  const getOrder = () => {
    let query = order_no
      ? {
          order_no,
          $and: [{ status: { $gte: 1 } }, { status: { $lt: 3 } }]
        }
      : {
          $and: [{ status: { $gte: 1 } }, { status: { $lt: 3 } }],
          _id
        };

    console.log(query);

    return Order.findOne(query, fields)
      .populate(populateQuery(populate))
      .catch(err => {
        throw err;
      });
  };

  async function main() {
    try {
      const order = await getOrder();
      console.log(`order id ${_id}`, order);
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
