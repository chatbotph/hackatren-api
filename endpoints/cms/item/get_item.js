const ItemSchema = require("../../../models/item"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists, populateQuery } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { fields, populate = "", client } = req.query;
  const Item = ItemSchema(client);

  const getItem = () =>
    Item.findOne({ _id: ObjectId(_id), status: 1 }, fields)
      .populate(populateQuery(populate))
      .catch(err => {
        throw err;
      });

  async function main() {
    try {
      const item = await getItem();
      if (isNotExists(item) === false) {
        sendData(res, "", item, 200);
      } else {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
