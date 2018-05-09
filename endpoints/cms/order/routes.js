const create_order_v1 = require("./create_order");
const get_orders_v1 = require("./get_orders");
const get_order_v1 = require("./get_order");
const edit_order_v1 = require("./edit_order");
const delete_order_v1 = require("./delete_order");
const order_paginate_v1 = require("./order_paginate");
const paginate_count_v1 = require("./paginate_count");

module.exports = api => {
  api.get({ path: "/api/v1/order/paginate" }, order_paginate_v1);
  api.get({ path: "/api/v1/order/paginate_count" }, paginate_count_v1);
  api.post({ path: "/api/v1/order" }, create_order_v1);
  api.get({ path: "/api/v1/order" }, get_orders_v1);
  api.get({ path: "/api/v1/order/:_id" }, get_order_v1);
  api.patch({ path: "/api/v1/order/:_id" }, edit_order_v1);
  api.del({ path: "/api/v1/order/:_id" }, delete_order_v1);
};
