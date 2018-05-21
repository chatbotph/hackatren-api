const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM }
  } = require("../utils/database");

const order = new Schema({
  customer: refGen("Delivery-Customer"),
  items: [{ quantity: requiredField(NUM), item: refGen("Delivery-Item") }],
  total_price: requiredField(STR),
  status: requiredField(NUM, true, 1), //0-archived 1-pending 2-delivered,
  timestamp: requiredField(NUM, true, Date.now()),
  order_no: requiredField(STR),
  remarks: requiredField(STR, false)
});

module.exports = mongoose.model("Delivery-Order", order);
