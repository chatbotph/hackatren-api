const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    fieldTypes: { STR, NUM }
  } = require("../utils/database");

const category = new Schema({
  name: requiredField(STR),
  status: requiredField(NUM, true, 1), //0-archived 1-active,
  timestamp: requiredField(NUM, true, Date.now())
});

module.exports = mongoose.model("Delivery-Category", category);
