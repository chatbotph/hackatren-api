const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM, OID, BOOL }
  } = require("../utils/database"),
  { DELIVERY_ORDER, DELIVERY_CUSTOMER, DELIVERY_ITEM } = require("../global"),
  ThreadSchema = require("./thread");

module.exports = prefix => {
  const modelName = `${prefix}-${DELIVERY_ORDER}`;
  const model = mongoose.connection.models[modelName];
  if (model) {
    return model;
  }

  const customerModel = `${prefix}-${DELIVERY_CUSTOMER}`;
  const itemModel = `${prefix}-${DELIVERY_ITEM}`;

  const Thread = ThreadSchema(prefix);  

  const order = new Schema({
    customer: refGen(customerModel),
    agent: requiredField(OID),
    items: [{ quantity: requiredField(NUM), item: refGen(itemModel) }],
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

  return mongoose.model(modelName, order);
};
