const create_order_v1 = require("./create_order");
const get_orders_v1 = require("./get_orders");
const get_order_v1 = require("./get_order");

module.exports = api => {
  api.post({ path: "/api/v1/order" }, create_order_v1);
  api.get({ path: "/api/v1/order" }, get_orders_v1);
  api.get({ path: "/api/v1/order/:_id" }, get_order_v1);
};
