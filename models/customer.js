const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM }
  } = require("../utils/database");

const customer = new Schema({
  messenger_id: requiredField(STR),
  name: requiredField(STR),
  contact_no: requiredField(STR),
  address: requiredField(STR),
  status: requiredField(NUM, true, 1), //0-archived 1-active,
  timestamp: requiredField(NUM, true, Date.now())
});

module.exports = mongoose.model("Delivery-Customer", customer);
