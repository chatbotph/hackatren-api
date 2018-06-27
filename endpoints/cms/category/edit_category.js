const CategorySchema = require("../../../models/category"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { client } = req.query;

  const Category = CategorySchema(client);

  const updateCategory = () =>
    Category.findByIdAndUpdate(_id, req.body).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const category = await Category.findById(_id);
      if (isNotExists(category) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await updateCategory();
        sendData(res, "Category Updated");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
