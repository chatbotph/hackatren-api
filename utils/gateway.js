const { stringify } = require("querystring");

module.exports.gateWayRequestUrl = MSRoute => {
  const qParams = stringify({
    MSPointname: process.env.USER_SERVICE_POINTNAME,
    MSRoute,
    client: process.env.APP_CLIENT
  });
  return `${process.env.GATEWAY_URL}?${qParams}`;
};
