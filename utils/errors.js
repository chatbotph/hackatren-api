const errors = require("restify-errors");

module.exports.errStatus = {
  SERVER_ERROR: message => new errors.InternalServerError({ message }),
  CONFILCT_ERROR: message => new errors.ConflictError({ message }),
  NOT_FOUND: message => new errors.NotFoundError({ message }),
  UNAUTHORIZED: message => new errors.UnauthorizedError({ message }),
  FORBIDDEN: message => new errors.ForbiddenError({ message }),
  BAD_REQUEST: message => new errors.BadRequestError({ message })
};

module.exports.errMsgs = {
  SERVER_ERROR_MSG: "Something went wrong",
  NOT_FOUND_MSG: "Resource not found",
  CONFLICT_MSG: "Resource conflict"
};

module.exports.errs = {
  SERVER_ERROR: "SERVER_ERROR",
  CONFILCT_ERROR: "CONFILCT_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  BAD_REQUEST: "BAD_REQUEST"
};
