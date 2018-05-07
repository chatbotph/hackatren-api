const create_category_v1 = require("./create_category");
const get_categories_v1 = require("./get_categories");
const get_category_v1 = require("./get_category");
const edit_category_v1 = require("./edit_category");
const delete_category = require("./delete_category");

module.exports = api => {
  api.post({ path: "/api/v1/category" }, create_category_v1);
  api.get({ path: "/api/v1/category" }, get_categories_v1);
  api.get({ path: "/api/v1/category/:_id" }, get_category_v1);
  api.patch({ path: "/api/v1/category/:_id" }, edit_category_v1);
  api.del({ path: "/api/v1/category/:_id" }, delete_category);
};
