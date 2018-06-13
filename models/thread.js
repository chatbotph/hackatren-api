const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    requiredField,
    refGen,
    fieldTypes: { STR, NUM, OID }
  } = require("../utils/database"),
  Message = require("./message");

const thread = new Schema({
  order: refGen("Delivery-Order"),
  // agent: requiredField(OID),
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

module.exports = mongoose.model("Delivery-Thread", thread);
