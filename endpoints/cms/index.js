const api = module.parent.exports.api;
require("./category/routes")(api);
require("./item/routes")(api);
require("./customer/routes")(api);
require("./order/routes")(api);
