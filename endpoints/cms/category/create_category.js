const Category = require("../../../models/category"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers");

module.exports = (req, res, next) => {
  const { name } = req.body;

  const checkExisting = () =>
    Category.findOne({ name, status: 1 }).catch(err => {
      throw err;
    });

  const createCategory = () => {
    const newCategory = new Category(req.body);
    return newCategory.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const check = await checkExisting();
      if (isNotExists(check) === true) {
        await createCategory();
        sendData(res, "Resource Created", "", 201);
      } else {
        sendError(res, CONFILCT_ERROR, CONFLICT_MSG);
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
