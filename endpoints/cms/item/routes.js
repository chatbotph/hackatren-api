const create_item_v1 = require("./create_item");
const get_items_v1 = require("./get_items");
const get_item_v1 = require("./get_item");

module.exports = api => {
  api.post({ path: "/api/v1/item" }, create_item_v1);
  api.get({ path: "/api/v1/item" }, get_items_v1);
  api.get({ path: "/api/v1/item/:_id" }, get_item_v1);
};
