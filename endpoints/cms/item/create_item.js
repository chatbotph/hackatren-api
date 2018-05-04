const Item = require("../../../models/item"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { isNotExists } = require("../../../utils/op-helpers");

module.exports = (req, res, next) => {
  const { name } = req.body;

  const checkExisting = () =>
    Item.findOne({ name, status: 1 }).catch(err => {
      throw err;
    });

  const createItem = () => {
    const newItem = new Item(req.body);
    return newItem.save().catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const check = await checkExisting();
      if (isNotExists(check) === true) {
        await createItem();
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
