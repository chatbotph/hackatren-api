const Order = require("../../../models/order"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { fields, customer = "", messenger_id = "" } = req.query;

  const getOrders = () => {
    let query = { status: 1 };
    if (customer !== "") {
      query["customer"] = ObjectId(customer);
    }
    console.log(query, fields);
    return Order.find(query, fields)
      .sort({ timestamp: -1 })
      .populate({ path: "customer items", select: "name price" })
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
