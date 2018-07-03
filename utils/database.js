const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  {
    Types: {
      String: STR,
      Date: DT,
      Number: NUM,
      ObjectId: OID,
      Boolean: BOOL
    }
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
    return {
      type,
      required,
      default: defaultVal
    };
  } else {
    return {
      type,
      required
    };
  }
};

const refGen = ref => ({
  type: OID,
  ref
});

const //mongoDB connect
  dbconn = (cb = () => {}) => {
    var URI = process.env.MONGODB_URI;
    mongoose.Promise = global.Promise;
    mongoose.connect(
      URI, {
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        config: {
          autoIndex: false
        }
      }
    );
    mongoose.connection
      .on("error", error => console.log("Error connecting to MongoLab:", error))
      .once("open", () => {
        cb();
        console.log(`Connected to ${URI} yay!`);
      });
  };

module.exports = {
  dbconn,
  requiredField,
  fieldTypes,
  refGen
};