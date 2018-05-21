const Order = require("../../../models/order"),
  Customer = require("../../../models/customer"),
  Thread = require("../../../models/thread"),
  {
    errs: { NOT_FOUND, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { decodeToken } = require("../../../utils/security"),
  randomstring = require("randomstring");

module.exports = (req, res, next) => {
  const {
    data: { _id: agentId }
  } = decodeToken(req.headers["authorization-token"]);
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

  const createThread = orderId =>
    new Thread({
      order: orderId,
      agent: agentId
    }).save();

  async function main() {
    try {
      const customer = await getCustomer();
      if (customer) {
        const { order_no, _id } = await createOrder(customer);
        await createThread(_id);
        sendData(res, "Resource created", { order_no }, 201);
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
