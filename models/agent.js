const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM }
  } = require("../utils/database");

const agent = new Schema({
  name: {
    first: requiredField(STR),
    last: requiredField(STR)
  },
  username: requiredField(STR),
  permission: requiredField(STR),
  email: requiredField(STR),
  contact_no: requiredField(STR),
  status: requiredField(NUM, true, 1), //0-archived 1-active,
  timestamp: requiredField(NUM, true, Date.now())
});

// customer.post("remove", async doc => {
//   try {
//     const { _id } = doc;
//     const orders = await Order.find({ customer: mongoose.Types.ObjectId(_id) });
//     orders.forEach(o => {
//       Order.findByIdAndRemove(o._id, (err, order) => {
//         order.remove();
//       });
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = mongoose.model("Delivery-Agent", agent);
