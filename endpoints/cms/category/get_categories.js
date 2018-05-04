const Category = require("../../../models/category"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { fields } = req.query;
  const getCategories = () =>
    Category.find({ status: 1 }, fields).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const categories = await getCategories();
      sendData(res, "", categories, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
