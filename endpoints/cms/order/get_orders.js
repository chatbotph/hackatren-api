const Order = require("../../../models/order"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { populateQuery } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const {
    fields,
    customer = "",
    messenger_id = "",
    populate = "",
    order_no = ""
  } = req.query;

  const getOrders = () => {
    let query = {
      $and: [{ status: { $gte: 1 } }, { status: { $lt: 3 } }]
    };
    if (customer !== "") {
      query["customer"] = ObjectId(customer);
    }

    if (messenger_id !== "") {
      query["messenger_id"] = messenger_id;
    }

    if (order_no !== "") {
      query["order_no"] = order_no;
    }

    return Order.find(query, fields)
      .sort({ timestamp: -1 })
      .populate(populateQuery(populate))
      .catch(err => {
        throw err;
      });
  };

  async function main() {
    try {
      const orders = await getOrders();
      sendData(res, "", orders, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
