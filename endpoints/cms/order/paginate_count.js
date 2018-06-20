const Order = require("../../../models/order"),
  {
    errs: { SERVER_ERROR },
    errMsgs: { SERVER_ERROR_MSG }
  } = require("../../../utils/errors"),
  { sendError, sendData } = require("../../../utils/uni-response"),
  { decodeToken } = require("../../../utils/security"),
  {
    Types: { ObjectId }
  } = require("mongoose"),
  moment = require("moment");

module.exports = (req, res, next) => {
  let agent = "";
  const {
    data: { _id, permission }
  } = decodeToken(req.headers["authorization-token"]);
  if (permission === "agent") {
    agent = _id;
  }
  const {
    pageSize = 30,
    page = 1,
    q = "",
    fields = "",
    start = "",
    end = "",
    populate = "",
    customer = ""
  } = req.query;

  const getOrders = () => {
    let query = {
      status: { $gt: 0 }
    };

    if (q !== "") {
      query.order_no = new RegExp(`${q}`, "i");
    }

    if (customer !== "") {
      query.customer = ObjectId(customer);
    }

    if (agent !== "") {
      query.agent = ObjectId(agent);
    }

    if (start !== "" && end !== "") {
      query["$and"] = [
        {
          timestamp: {
            $gte: moment(start)
              .startOf("d")
              .valueOf()
          }
        },
        {
          timestamp: {
            $lte: moment(end)
              .endOf("d")
              .valueOf()
          }
        }
      ];
    } else if (start !== "") {
      query.timestamp = {
        $gte: moment(start)
          .startOf("d")
          .valueOf()
      };
    } else if (end !== "") {
      query.timestamp = {
        $gte: moment(end)
          .startOf("d")
          .valueOf()
      };
    }

    return Order.count(query).catch(err => {
      throw err;
    });
  };

  async function main() {
    try {
      const orderCount = await getOrders();
      console.log(orderCount);
      sendData(res, "", orderCount, 200);
    } catch (error) {
      console.error(error);
      sendError(res, SERVER_ERROR, SERVER_ERROR_MSG);
    }
  }

  main();
};
