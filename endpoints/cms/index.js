const api = module.parent.exports.api;
const socket = require("../../socket")(api);
require("./category/routes")(api);
require("./item/routes")(api);
require("./customer/routes")(api);
require("./order/routes")(api, socket);
require("./thread/routes")(api, socket);
require("./message/routes")(api, socket);
