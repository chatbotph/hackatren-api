const Order = require("../../../models/order"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { sendMessage } = require("../../../utils/fb-helper"),
  {
    messages: { FOR_DELIVERY, DELIVERED, REJECTED, PENDING }
  } = require("../../../utils/notifs"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  let validId = ObjectId.isValid(_id);

  const updateOrder = () => {
    let query = validId
      ? { status: 1, _id: ObjectId(_id) }
      : {
          order_no: _id,
          status: 1
        };
    return Order.findOneAndUpdate(query, req.body).catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      let order;
      if (validId) {
        order = await Order.findById(_id).populate("customer", "messenger_id");
      } else {
        order = await Order.findOne({ order_no: _id }).populate(
          "customer",
          "messenger_id"
        );
      }
      if (isNotExists(order) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await updateOrder();
        if (req.body.status) {
          const {
            customer: { messenger_id },
            order_no
          } = order;
          switch (Number(req.body.status)) {
            case 1: {
              sendMessage(messenger_id, PENDING(order_no));
              break;
            }
            case 2: {
              sendMessage(messenger_id, FOR_DELIVERY(order_no));
              break;
            }
            case 3: {
              sendMessage(messenger_id, DELIVERED(order_no));
              break;
            }
            case 4: {
              sendMessage(messenger_id, REJECTED(order_no));
              break;
            }
            default: {
              break;
            }
          }
        }

        sendData(res, "Order Updated");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
