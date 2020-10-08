/* 
devErr is used for developers and contains those error which occured on the server
and should be seen by developers
userErr :- beacause user did something wrong like invalid input etc.
*/
const fs = require("fs");
const util = require("util");
let appendFile = util.promisify(fs.appendFile);
const path = require("path");
/**
 *pass obj (has three properties) response: which was sent to the client,
 *isError:if there was any error, if true pass devErr:which is error
 *
 * @param {*} obj
 */
module.exports.log = async (obj) => {
  const { response, isError, devErr } = obj;
  try {
    if (isError) {
      console.log(devErr);
      await this.writeErrLog(devErr);
    }
    await this.writeResponseLog(response);
  } catch (error) {
    console.error("logging service failed");
    console.log("mail developers");
  }
};

exports.writeErrLog = async function writeErrLog(error) {
  await appendFile(
    path.join(process.cwd(), "logs", "error_logs.log"),
    "\nerror on " + new Date().toString() + " error is " + JSON.stringify(error)
  );
};

exports.writeResponseLog = async function writeResponseLog(responseObj) {
  await appendFile(
    path.join(process.cwd(), "logs", "response_logs.log"),
    "\n response sent on " +
      new Date().toString() +
      " is " +
      JSON.stringify(responseObj)
  );
};
