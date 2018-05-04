const Category = require("../../../models/category"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  const { _id } = req.params;
  const { fields } = req.query;

  const getCategory = () =>
    Category.findOne({ _id: ObjectId(_id), status: 1 }, fields).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const category = await getCategory();
      if (isNotExists(category) === false) {
        sendData(res, "", category, 200);
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
