const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    fieldTypes: { STR, NUM }
  } = require("../utils/database"),
  { DELIVERY_CATEGORY } = require("../global");

module.exports = prefix => {
  const modelName = `${prefix}-${DELIVERY_CATEGORY}`;
  const model = mongoose.connection.models[modelName];
  if (model) {
    return model;
  }
  const category = new Schema({
    name: requiredField(STR),
    status: requiredField(NUM, true, 1), //0-archived 1-active,
    timestamp: requiredField(NUM, true, Date.now())
  });
  return mongoose.model(modelName, category);
};
