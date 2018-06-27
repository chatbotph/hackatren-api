const CategorySchema = require("../../../models/category"),
  ItemSchema = require("../../../models/item"),
  {
    errs: { SERVER_ERROR, NOT_FOUND, CONFILCT_ERROR },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { client } = req.query;

  const Category = CategorySchema(client);
  const Item = ItemSchema(client);

  const checkItem = () =>
    Item.findOne({ categories: { $elemMatch: { $eq: ObjectId(_id) } } }).catch(
      err => {
        throw err;
      }
    );

  const removeCategory = () =>
    Category.findByIdAndRemove(_id).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const category = await Category.findById(_id);
      if (isNotExists(category) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        const itemCheck = await checkItem();
        if (isNotExists(itemCheck) === true) {
          await removeCategory();
          sendData(res, "Category deleted");
        } else {
          sendError(
            res,
            CONFILCT_ERROR,
            "Some entities depends on this category, thus you cannot delete it"
          );
        }
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
