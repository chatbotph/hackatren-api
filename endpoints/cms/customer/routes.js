const create_customer_v1 = require("./create_customer");
const get_customers_v1 = require("./get_customers");
const get_customer_v1 = require("./get_customer");
const edit_customer_v1 = require("./edit_customer");
const delete_customer_v1 = require("./delete_customer");

module.exports = api => {
  api.post({ path: "/api/v1/customer" }, create_customer_v1);
  api.get({ path: "/api/v1/customer" }, get_customers_v1);
  api.get({ path: "/api/v1/customer/:_id" }, get_customer_v1);
  api.patch({ path: "/api/v1/customer/:_id" }, edit_customer_v1);
  api.del({ path: "/api/v1/customer/:_id" }, delete_customer_v1);
};
