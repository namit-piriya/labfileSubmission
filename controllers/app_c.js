const dbConn = require("../util/db_util");
const log = require("../util/log").log;

module.exports.getDept = async (req, res) => {
  let isError, devErr, response;
  try {
    let conn = await dbConn();
    let data = await conn
      .collection("curriculum")
      .find({}, { projection: { _id: 1 } })
      .toArray();
    // .map((element) => element["_id"]);
    // console.log(data);
    data = data.map((element) => element["_id"]);
    response = {
      data,
      code: 200,
    };
  } catch (error) {
    // console.log(error);
    isError = true;
    devErr = error;
    response = {
      code: 500,
      msg: errMessage,
      error: true,
    };
  } finally {
    res.status(response.code).json(response);
    log({ response, devErr, isError });
    return;
  }
};
