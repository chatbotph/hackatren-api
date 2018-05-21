const jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  {
    errs: { FORBIDDEN, SERVER_ERROR }
  } = require("./errors"),
  { sendError } = require("./uni-response");

//generate JWT access token
exports.generateAppAccessToken = payload => {
  let key = "dsds";
  return jwt.sign(payload, key, { expiresIn: "365d" });
};

//for hashing password
exports.hashPassword = password => {
  saltRounds = 10;
  return bcrypt
    .hash(password, saltRounds)
    .then(data => data)
    .catch(err => {
      throw err;
    });
};

//for comparing passwords
exports.comparePasswords = (passedPassword, storedPassword) => {
  //console.log(passedPassword, storedPassword);
  return bcrypt
    .compare(passedPassword, storedPassword)
    .then(data => data)
    .catch(err => err);
};

//generate JWT access token
exports.generateAppAccessToken = payload => {
  let key = process.env.JWT_SECRET;
  return jwt.sign(payload, key, { expiresIn: "365d" });
};

const findClientAccount = _id => {
  return Client.findOne({
    $and: [{ _id }, { account_status: 1 }]
  })
    .then(data => data)
    .catch(err => {
      throw err;
    });
};

//validate JWT access token
exports.validateAppToken = (req, res, next) => {
  // console.log(req.headers);
  var token = req.headers["x-access-token"] || undefined,
    key = "dsds",
    //jwt verify callback
    verifyCb = (err, tokenData) => {
      async function main() {
        try {
          const { _id } = tokenData;
          var account = await findClientAccount(_id);
          if (account !== null) {
            return next();
          } else {
            sendError(res, FORBIDDEN, "Invalid Access token");
          }
        } catch (e) {
          console.log(e);
          sendError(res, SERVER_ERROR, "Something went wrong");
        }
      }
      main();
    };

  // console.log(token)
  if (token) {
    jwt.verify(token, key, verifyCb);
  } else {
    sendResponse(res, 403, CODE_FORBIDDEN, "Invalid access token");
  }
};

exports.decodeToken = token => {
  return jwt.decode(token);
};
