const create_category_v1 = require("./create_category");
const get_categories_v1 = require("./get_categories");
const get_category_v1 = require("./get_category");

module.exports = api => {
  api.post({ path: "/api/v1/category" }, create_category_v1);
  api.get({ path: "/api/v1/category" }, get_categories_v1);
  api.get({ path: "/api/v1/category/:_id" }, get_category_v1);
};
