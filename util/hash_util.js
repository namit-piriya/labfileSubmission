const bcrypt = require("bcrypt");
const keys = require("../config/keys");

module.exports.hashPass = async (pass) => {
  try {
    const SALT = await bcrypt.genSalt(keys.hashRounds);
    const hashedPass = await bcrypt.hash(pass, SALT);
    return hashedPass;
  } catch (error) {
    throw new Error("Bcrypt error while hashing" + error);
  }
};

module.exports.comparePass = async (pass, hashedPass) => {
  try {
    let result = await bcrypt.compare(pass, hashedPass);
    return result;
  } catch (error) {
    throw new Error("Bcrypt error while hashing" + error);
  }
};