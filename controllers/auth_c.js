const TeacherModel = require("../models/teacher_m");
const StudentModel = require("../models/student_m");
const hodModel = require("../models/hod_m");
const { checkPass } = require("../util/gen_util");
const lognsend = require("../util/log").log;
const checkEmail = require("../util/gen_util").checkEmail;
const getToken = require("../util/token_util").getToken;

exports.loginUser = async (req, res) => {
  let isError, devErr, response;
  const { body } = req;
  const { email, password, rememberUser, userType } = body;
  if (!email || !checkEmail(email) || !password || !userType) {
    response = {
      userErr: "please Provide valid input or email",
      code: 400,
    };
    res.status(response.code).json(response);
    return await lognsend({
      response,
      isError,
      devErr,
    });
  }

  let result;
  try {
    if (userType === "student")
      result = await StudentModel.loginStudent(email, password);
    else if (userType === "teacher") {
      result = await TeacherModel.loginTeacher(email, password);
    } else if (userType === "hod") {
      result = await hodModel.loginhod(email, password);
    } else if (result !== undefined) {
      response = {
        userErr: "please provide right user type",
        code: 400,
      };
    }
    if (result !== null && typeof result === "object") {
      let { dept } = result;
      const token = getToken(
        {
          email,
          dept,
        },
        rememberUser
      );
      // await saveToken(token);
      response = {
        msg: "successfully LoggedIn",
        token: token,
        code: 200,
      };
    } else if (result === "NOT_VERIFIED") {
      response = {
        userErr: "You are not verified",
        code: 200,
      };
    } else if (result === "NO_USER") {
      response = {
        userErr: "there is no user with the given email",
        code: 200,
      };
    } else {
      !response
        ? (response = {
            userErr: "email or password is wrong",
            code: 200,
          })
        : response;
    }
  } catch (error) {
    isError = true;
    devErr = error;
    response = {
      msg: errMessage,
      code: 500,
    };
  } finally {
    res.status(response.code).json(response);
    return await lognsend({
      response,
      isError,
      devErr,
    });
  }
};
