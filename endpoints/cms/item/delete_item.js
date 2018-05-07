const Order = require("../../../models/order"),
  Item = require("../../../models/item"),
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

  const checkOrders = () =>
    Order.findOne({ items: { $elemMatch: { $eq: ObjectId(_id) } } }).catch(
      err => {
        throw err;
      }
    );

  const removeItem = () =>
    Item.findByIdAndRemove(_id).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const item = await Item.findById(_id);
      if (isNotExists(item) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        const orderCheck = await checkOrders();
        if (isNotExists(orderCheck) === true) {
          await removeItem();
          sendData(res, "Item deleted");
        } else {
          sendError(
            res,
            CONFILCT_ERROR,
            "Some entities depends on this item, thus you cannot delete it"
          );
        }
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};