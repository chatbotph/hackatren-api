const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM }
  } = require("../utils/database");

const item = new Schema({
  name: requiredField(STR),
  description: requiredField(STR),
  price: requiredField(STR),
  image: requiredField(STR),
  status: requiredField(NUM, true, 1), //0-archived 1-active,
  categories: [refGen("Delivery-Category")],
  timestamp: requiredField(NUM, true, Date.now())
});

module.exports = mongoose.model("Delivery-Item", item);
