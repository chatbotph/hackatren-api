const ItemSchema = require("../../../models/item"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { populateQuery } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { fields, category = "", populate = "", client } = req.query;
  const Item = ItemSchema(client);

  const getItems = () => {
    let query = {
      status: 1
    };
    if (category !== "") {
      query["categories"] = { $elemMatch: { $eq: ObjectId(category) } };
    }
    return Item.find(query, fields)
      .populate(populateQuery(populate))
      .catch(err => {
        throw err;
      });
  };

  async function main() {
    try {
      const items = await getItems();
      sendData(res, "", items, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
