const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM }
  } = require("../utils/database"),
  { DELIVERY_CUSTOMER } = require("../global"),
  OrderSchema = require("./order");

module.exports = prefix => {
  const modelName = `${prefix}-${DELIVERY_CUSTOMER}`;
  const model = mongoose.connection.models[modelName];
  if (model) {
    return model;
  }
  const customer = new Schema({
    messenger_id: requiredField(STR),
    img_url: requiredField(STR),
    name: requiredField(STR),
    contact_no: requiredField(STR),
    address: requiredField(STR),
    status: requiredField(NUM, true, 1), //0-archived 1-active,
    timestamp: requiredField(NUM, true, Date.now())
  });

  const Order = OrderSchema(prefix);

  customer.post("remove", async doc => {
    try {
      const { _id } = doc;
      const orders = await Order.find({
        customer: mongoose.Types.ObjectId(_id)
      });
      orders.forEach(o => {
        Order.findByIdAndRemove(o._id, (err, order) => {
          order.remove();
        });
      });
    } catch (error) {
      console.log(error);
    }
  });
  return mongoose.model(modelName, customer);
};
