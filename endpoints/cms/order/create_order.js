const Order = require("../../../models/order"),
  Customer = require("../../../models/customer"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers"),
  randomstring = require("randomstring");

module.exports = (req, res, next) => {
  const { name, messenger_id } = req.body;

  const getCustomer = () =>
    Customer.findOne({ messenger_id, status: 1 }).catch(err => {
      throw err;
    });

  const createOrder = customer => {
    const { _id } = customer;
    req.body.customer = _id;
    req.body.order_no = randomstring.generate({
      length: 6,
      capitalization: "uppercase"
    });
    const newOrder = new Order(req.body);
    return newOrder.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const customer = await getCustomer();
      await createOrder(customer);
      sendData(res, "Resource created", {}, 201);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
