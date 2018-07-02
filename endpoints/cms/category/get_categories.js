const CategorySchema = require("../../../models/category"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {

  const { fields, client } = req.query;
  
  const Category = CategorySchema(client);
  
  const getCategories = () =>
    Category.find({}, fields).catch(err => {
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
