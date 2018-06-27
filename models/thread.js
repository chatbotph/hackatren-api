const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM, OID }
  } = require("../utils/database"),
  { DELIVERY_ORDER, DELIVERY_THREAD } = require("../global"),
  Message = require("./message");

module.exports = prefix => {
  const modelName = `${prefix}-${DELIVERY_THREAD}`;
  const model = mongoose.connection.models[modelName];
  if (model) {
    return model;
  }

  const orderModel = `${prefix}-${DELIVERY_ORDER}`;

  const thread = new Schema({
    order: refGen(orderModel),
    status: requiredField(NUM, true, 1), //0-archived 1-active,
    last_activity: requiredField(NUM, true, Date.now()),
    timestamp: requiredField(NUM, true, Date.now())
  });

  thread.post("remove", doc => {
    const { _id } = doc;
    console.log("thread messages removed");
    Message.remove({ thread: mongoose.Types.ObjectId(_id) }).then(d => {
      console.log("thread messages removed", _id);
    });
  });

  return mongoose.model(modelName, thread);
};
