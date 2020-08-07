if (process.env.NODE_ENV === "prod") {
  const prod = require("../config/prod");
  module.exports = prod;
} else {
  const dev = require("../config/dev");
  module.exports = dev;
}
