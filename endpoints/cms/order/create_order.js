const OrderSchema = require("../../../models/order"),
  CustomerSchema = require("../../../models/customer"),
  ThreadSchema = require("../../../models/thread"),
  {
    errs: { NOT_FOUND, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { decodeToken } = require("../../../utils/security"),
  randomstring = require("randomstring");

module.exports = (req, res, next) => {
  const { name, messenger_id } = req.body;
  const { client } = req.query;

  const agentId =
    client === "jolibeee"
      ? "5b39fa6fa2f4e3373816c4de"
      : "5b32f57d0ec26f3050c3889d";

  const Order = OrderSchema(client);
  const Customer = CustomerSchema(client);
  const Thread = ThreadSchema(client);

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
    const newOrder = new Order(Object.assign({ agent: agentId }, req.body));
    return newOrder.save().catch(err => {
      throw err;
    });
  };

  const createThread = orderId =>
    new Thread({
      order: orderId
    }).save();

  async function main() {
    try {
      const customer = await getCustomer();
      if (customer) {
        let order = await createOrder(customer);
        order = await Order.findById(order._id).populate({
          path: "customer",
          select: "name contact_no address"
        });
        let thread = await createThread(order._id);
        thread = await Thread.findById(thread._id).populate({
          path: "order",
          select: "customer order_no",
          populate: { path: "customer", select: "name" }
        });
        console.log(thread);
        req.payload = {
          agent: agentId,
          thread,
          order
        };
        req.org = client;
        next();
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
