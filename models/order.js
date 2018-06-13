const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM, OID, BOOL }
  } = require("../utils/database"),
  Thread = require("./thread");

const order = new Schema({
  customer: refGen("Delivery-Customer"),
  agent: requiredField(OID),
  items: [{ quantity: requiredField(NUM), item: refGen("Delivery-Item") }],
  total_price: requiredField(STR),
  status: requiredField(NUM, true, 1), //0-archived 1-pending 2-for delivery 3-delivered 4 canceled,
  timestamp: requiredField(NUM, true, Date.now()),
  order_no: requiredField(STR),
  remarks: requiredField(STR, false),
  rating: requiredField(NUM, true, 0),
  hop: requiredField(BOOL, true, false)
});

order.post("remove", doc => {
  const { _id } = doc;
  Thread.findOneAndRemove(
    { order: mongoose.Types.ObjectId(_id) },
    (err, thread) => {
      thread.remove();
    }
  ).then(d => {
    console.log("thread order removed", _id);
  });
});

module.exports = mongoose.model("Delivery-Order", order);
