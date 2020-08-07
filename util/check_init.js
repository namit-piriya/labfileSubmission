const dbConnection = require("./db_util");
const logUtil = require("./log");
module.exports = async function () {

  const db = await dbConnection();
  const {
    writeErrLog,
    writeResponseLog
  } = logUtil;
  await writeErrLog({
    code: "Jai Shree Ganesh",
    msg: "Dummy Error",
  });
  await writeResponseLog({
    code: "Jai Shree Ganesh",
    msg: "Dummy Response",
  });
};