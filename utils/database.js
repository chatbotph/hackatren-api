const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    Types: { String: STR, Date: DT, Number: NUM, ObjectId: OID, Boolean: BOOL }
  } = Schema;

const fieldTypes = {
  STR,
  DT,
  NUM,
  OID,
  BOOL
};

const requiredField = (type, required = true, defaultVal = undefined) => {
  if (defaultVal !== undefined) {
    return { type, required, default: defaultVal };
  } else {
    return { type, required };
  }
};

const refGen = ref => ({ type: OID, ref });

const //mongoDB connect
dbconn = () => {
  var URI = process.env.MONGODB_URI;
  mongoose.Promise = global.Promise;
  mongoose.connect(URI, { config: { autoIndex: false } });
  mongoose.connection
    .on("error", error => console.log("Error connecting to MongoLab:", error))
    .once("open", () => console.log(`Connected to ${URI}`));
};

module.exports = {
  dbconn,
  requiredField,
  fieldTypes,
  refGen
};
