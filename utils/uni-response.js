const { errStatus } = require("./errors");

module.exports.sendData = (res, message = "", data = {}, code = 200) =>
  res.send(code, { message, data });

module.exports.sendError = (res, err, message) => {
  const error = errStatus[err](message);
  res.send(error);
};
