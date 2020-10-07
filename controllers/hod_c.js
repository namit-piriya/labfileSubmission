const hodModel = require("../models/hod_m");
const User = require("../models/user_m");
const TeacherModel = require("../models/teacher_m");
const { checkSubcode, checkEmail } = require("../util/gen_util");
const log = require("../util/log").log;

module.exports.getUnverifiedUsers = async (req, res) => {
  const userType = req.query.user_type;
  const dept = req.body.data.dept;
  let response, result, isError, devErr;
  try {
    if (userType === "student") {
      result = await hodModel.getUnverified(userType, dept);
      response = {
        students: result,
        code: 200,
      };
    } else if (userType === "teacher") {
      result = await hodModel.getUnverified(userType, dept);
      response = {
        teachers: result,
        code: 200,
      };
    } else {
      response = {
        userErr: "any other userType not allowed",
        code: 400,
      };
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
    return await log({
      response,
      isError,
      devErr,
    });
  }
};

module.exports.verifyUser = async (req, res) => {
  let response, isError, devErr;
  const toVerify = req.body.email;

  // console.log(JSON.stringify(req.body));
  const userType = req.query.user_type.trim();
  const { email } = req.body.data;
  console.log("email is ", email);
  let result;
  // console.log(1);
  if (!userType) {
    response = {
      error: false,
      userErr: "please specify user Type",
      code: 400,
    };
    res.status(response.code).json(response);
    return await log({ response });
  } else if (!checkEmail(toVerify)) {
    response = {
      error: false,
      userErr: "please send right email",
      code: 400,
    };
    res.status(response.code).json(response);
    return await log({ response });
  }
  try {
    if (userType === "student") {
      result = await User.verifyUser(
        toVerify,
        {
          email,
          role: "hod",
        },
        "students"
      );

      if (result) {
        response = {
          code: 200,
          msg: "User Verified",
        };
      } else {
        response = {
          msg: errMessage,
          code: 500,
        };
      }
    } else if (userType === "teacher") {
      console.log("I am in");
      result = await User.verifyUser(
        toVerify,
        {
          email,
          role: "hod",
        },
        "teachers"
      );
      if (result) {
        response = {
          msg: "User Verified",
          code: 200,
        };
        console.log(response);
      } else {
        response = {
          msg: errMessage,
          code: 500,
        };
      }
    }
  } catch (error) {
    devErr = error;
    isError = true;
    response = {
      error: true,
      msg: errMessage,
      code: 500,
    };
  } finally {
    console.log(response);
    res.status(response.code).json(response);
    return await log({
      response,
      isError,
      devErr,
    });
  }
};
// module.exports.getSubInSem = async (req, res) => {
// };

// module.exports.getUnassignedSubjects = async (req, res) => {

// };

// only saving is possible cannot update the curriculum for now
module.exports.saveCurriculum = async (req, res) => {
  let isError, devErr, result, response;
  const { body } = req;

  const { dept } = body.data;
  /*
		semAndSub will be an array of object which will be
		{	sem:
			subjects:[]
		}
	*/
  const { semAndSub } = body;
  // console.log(req.body);
  try {
    result = await hodModel.saveSubjects(dept, semAndSub);
    if (result === "ALREADY_EXISTS") {
      response = {
        code: 200,
        msg: "curriculum already exists",
      };
    } else if (result) {
      response = {
        msg: "Curriculum saved",
        code: 200,
      };
    }
  } catch (error) {
    isError = true;
    devErr = error;
    response = {
      code: 500,
      msg: errMessage,
    };
  } finally {
    res.status(response.code).json(response);
    return await log({
      response,
      devErr,
      isError,
    });
  }
};

module.exports.generateMarksheet = (req, res) => {};

module.exports.updateCurriculum = (req, res) => {};

// console.log("env variable are ", process.env.DB_STRING, process.env.DB);
module.exports.addSubToTeacher = async (req, res) => {
  let response, isError, devErr;
  const { body } = req;

  const { dept } = req.body.data;

  const { subName, subcode, teacherEmail } = body;

  if (!subcode || !subName || !teacherEmail) {
    response = {
      userErr: "input not valid ",
      code: 200,
    };
    res.status(response.code).json(response);
    return await log({
      response,
    });
  }

  if (!checkSubcode(subcode, dept)) {
    response = {
      userErr: "subcode is not valid ",
      code: 200,
    };
    res.status(response.code).json(response);
    return await log({
      response,
    });
  }

  try {
    result = await TeacherModel.addSubject(subName, subcode, teacherEmail);
    if (result === true) {
      response = {
        msg: "successfully assigned the subject to given Teacher",
        code: 200,
      };
    } else {
      response = {
        msg: "couldn't update the teacher subjects contact to admin",
        code: 500,
      };
    }
  } catch (error) {
    isError = true;
    devErr = {
      error,
      msg: "in the addSubToTeacher",
    };
    response = {
      msg: errMessage,
      code: 500,
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

// module.exports.infoOfSem = (req, res) => {
//   let isError, devErr, response;
//   let sem = req.params.sem;
// };

module.exports.infoOfTeachers = async (req, res) => {
  const { dept } = req.body.data;
  let isError, devErr, response;

  try {
    let result = await hodModel.infoOfTeachers(dept);
    // console.log(result);
    response = { teachers: result, code: 200 };
    res.status(response.code).json(response);
    await log({ response });
  } catch (error) {
    isError = true;
    devErr = error;
    response = {
      error: true,
      msg: errMessage,
      code: 500,
    };
    res.status(response.code).json(response);
    await log({ response });
  }
};
