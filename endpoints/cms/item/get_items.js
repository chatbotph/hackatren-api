const Item = require("../../../models/item"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response");

module.exports = (req, res, next) => {
  const { fields } = req.query;
  const getItems = () =>
    Item.find({ status: 1 }, fields)
      .populate({ path: "categories", select: "name" })
      .catch(err => {
        throw err;
      });

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
