const Item = require("../../../models/item"),
  {
    errs: { SERVER_ERROR, NOT_FOUND },
    errMsgs: { SERVER_ERROR_MSG, NOT_FOUND_MSG }
  } = require("../../../utils/errors"),
  { isNotExists } = require("../../../utils/op-helpers"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { _id } = req.params;

  const updateItem = () =>
    Item.findByIdAndUpdate(_id, req.body).catch(err => {
      throw err;
    });

  async function main() {
    try {
      const item = await Item.findById(_id);
      if (isNotExists(item) == true) {
        sendError(res, NOT_FOUND, NOT_FOUND_MSG);
      } else {
        await updateItem();
        sendData(res, "Item Updated");
      }
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
