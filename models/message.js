const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM, OID }
  } = require("../utils/database"),
  { DELIVERY_MESSAGE, DELIVERY_THREAD } = require("../global");

module.exports = prefix => {
  const modelName = `${prefix}-${DELIVERY_MESSAGE}`;
  const model = mongoose.connection.models[modelName];
  if (model) {
    return model;
  }
  const threadModel = `${prefix}-${DELIVERY_THREAD}`;

  const message = new Schema({
    thread: refGen(threadModel),
    message: requiredField(STR),
    type: requiredField(NUM), //0-agent, 1-client -2 admin
    status: requiredField(NUM, true, 0), //-1 archived  0, unread, 1 read
    timestamp: requiredField(NUM, true, Date.now())
  });
  return mongoose.model(modelName, message);
};
