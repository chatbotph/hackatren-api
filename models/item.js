const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM }
  } = require("../utils/database"),
  { DELIVERY_ITEM, DELIVERY_CATEGORY } = require("../global");

module.exports = prefix => {
  const modelName = `${prefix}-${DELIVERY_ITEM}`;
  const model = mongoose.connection.models[modelName];
  if (model) {
    return model;
  }

  const item = new Schema({
    name: requiredField(STR),
    description: requiredField(STR),
    price: requiredField(STR),
    image: requiredField(STR),
    status: requiredField(NUM, true, 1), //0-archived 1-active,
    categories: [refGen(`${prefix}-${DELIVERY_CATEGORY}`)],
    timestamp: requiredField(NUM, true, Date.now())
  });

  return mongoose.model(modelName, item);
};
