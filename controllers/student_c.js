const StudentModel = require("../models/student_m");
const { isEmpty } = require("lodash");
const log = require("../util/log").log;
const checkEmail = require("../util/gen_util").checkEmail;
const checkPass = require("../util/gen_util").checkPass;

exports.registerStudent = async (req, res) => {
  let isError, response;
  let devErr;
  const { body } = req;
  const { email, fullName, password, enrollno, dept } = body;

  console.log(email, fullName, password, enrollno, dept);
  debugCon({
    email,
    fullName,
    password,
    enrollno,
    dept,
  });

  if (!email || !password | !enrollno || !dept || !fullName) {
    response = {
      userErr: "please Provide valid input or email",
      code: 400,
    };
  } else if (isEmpty(checkEmail(email))) {
    response = {
      userErr: "please Provide valid email",
      code: 400,
    };
  } else if (isEmpty(checkPass(password))) {
    response = {
      userErr: "please Provide valid password",
      code: 400,
    };
  }

  if (response !== undefined && response.userErr) {
    res.status(response.code).json(response);
    return await log({
      response,
      isError,
      devErr,
    });
  }
  const student = new StudentModel(fullName, email, enrollno, password, dept);
  let result, obj;
  try {
    result = await student.registerStudent();
    if (result === true) {
      response = {
        code: 200,
        error: false,
        msg: "registration successful, procceed with verification.",
      };
    } else if (result == false) {
      response = {
        code: 200,
        error: false,
        msg: "please contact to hod about your sem and year",
      };
    } else if (result === "EMAIL_EXISTS") {
      response = {
        code: 400,
        userErr: "Email already exists.",
      };
    } else {
      response = {
        msg: errMessage,
        code: 500,
        error: true,
      };
      isError = true;
      devErr = error;
      debugCon("result is ", result);
    }
  } catch (error) {
    isError = true;
    devErr = error;
    response = {
      code: 500,
      error: true,
      msg: "please contact to admin",
    };
  } finally {
    res.status(response.code).json(response);
    await log({
      response,
      isError,
      devErr,
    });
  }
};
