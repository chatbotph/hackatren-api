const Thread = require("../../../models/thread"),
  {
    errs: { CONFILCT_ERROR, SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG, CONFLICT_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { decodeToken } = require("../../../utils/security"),
  { populateQuery } = require("../../../utils/op-helpers"),
  {
    Types: { ObjectId }
  } = require("mongoose");

module.exports = (req, res, next) => {
  let { fields, populate = "" } = req.query;

  const getThreads = () =>
    Thread.find({ status: 1 }, fields)
      .populate({
        path: "order",
        select: "customer order_no",
        populate: { path: "customer", select: "name" }
      })
      .catch(err => {
        throw err;
      });

  async function main() {
    try {
      const threads = await getThreads();
      console.log(threads);
      sendData(res, "", threads);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
