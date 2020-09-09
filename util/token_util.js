const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const util = require("util");

const secret = keys.JWT_SEC;
exports.getToken = (tokenData, rememberUser) => {
  // req.mobno = mobno;
  const {
    email,
    dept
  } = tokenData;
  let jwtToken = jwt.sign({
    email,
    dept
  }, secret, {
    expiresIn: rememberUser ? "30d" : "1d",
  });
  return jwtToken;
};

exports.verifyToken = async (token) => {
  const verifyJWT = util.promisify(jwt.verify);
  let data;
  try {
    data = await verifyJWT(token, secret);
  } catch (error) {
    console.log("error in verifyToken");
    throw new Error(error.message);
  }
  return data;
};