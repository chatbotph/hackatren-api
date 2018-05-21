const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM, OID }
  } = require("../utils/database");

const message = new Schema({
  thread: refGen("Delivery-Thread"),
  message: requiredField(STR),
  type: requiredField(NUM), //0-agent, 1-client
  status: requiredField(NUM, true, 0), //-1 archived  0, unread, 1 read
  timestamp: requiredField(NUM, true, Date.now())
});

module.exports = mongoose.model("Delivery-Message", message);
