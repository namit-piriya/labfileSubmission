const lognsend = require("../util/log").log;
const jwtUtil = require("../util/token_util");

// check authorization
/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @return {*} nothing
 * checks if a user is loggedIn using jwt
 * if not sends a reponse saying user not loggedIn
 */
module.exports.isAuthorized = async (req, res, next) => {
  let response, isError, devErr;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const data = await jwtUtil.verifyToken(token);
      req.body.data = data;
      next();
      return;
    } catch (error) {
      // console.log(error.message + "in isAuthorized");
      if (
        error.message === "invalid signature" ||
        error.message.includes("jwt expired")
      ) {
        response = {
          userErr: "Please login again,token expired",
          code: 403,
        };
      } else {
        isError = true;
        devErr = error;
        response = {
          msg: errMessage,
          code: 500,
        };
      }
      res.status(response.code).json(response);
      return await lognsend({
        response,
        isError,
        devErr,
      });
    }
  } else {
    response = {
      code: 403,
      error: false,
      userErr: "you are not logged in",
    };
    res.status(response.code).json(response);
    return await lognsend({
      response,
    });
  }
};
