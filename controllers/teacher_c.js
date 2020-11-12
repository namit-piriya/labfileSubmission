const TeacherModel = require("../models/teacher_m");
const { isEmpty, isArray } = require("lodash");
const { checkSubcode } = require("../util/gen_util");
const log = require("../util/log").log;
const checkEmail = require("../util/gen_util").checkEmail;
const checkPass = require("../util/gen_util").checkPass;

module.exports.registerTeacher = async (req, res) => {
  let isError, response, devErr;
  const { body } = req;
  const { email, name, password, dept } = body;

  if (!email || !password || !dept || !name) {
    response = {
      userErr: "please Provide valid input",
      code: 400,
    };
    return await log(response);
  }

  if (isEmpty(checkEmail(email))) {
    response = {
      userErr: "please Provide valid  email",
      code: 400,
    };
    return await log(response);
  }

  if (isEmpty(checkPass(password))) {
    response = {
      userErr: "please Provide valid password",
      code: 400,
    };
    return await log(response);
  }

  let result;
  try {
    result = await TeacherModel.registerTeacher(email, name, password, dept);

    if (result === true) {
      response = {
        code: 200,
        apiCode: "success",
        msg: "Successfully registered,Please contact hod to get verified",
      };
    } else if (result === "EMAIL_EXISTS") {
      response = {
        code: 200,
        apiCode: "EMAIL_EXISTS",
        msg: "requested email already exists with another user",
      };
    } else {
      response = {
        code: 200,
        apiCode: "student_email_exists",
        msg: "same email in students account exist",
      };
    }

    res.status(response.code).json(response);
    return await log({
      response: response,
    });
  } catch (error) {
    isError = true;
    devErr = error;
    response = {
      code: 500,
      apiCode: "error",
      msg: errMessage,
    };
    res.status(response.code).json(response);
    return await log({
      devErr,
      isError,
      response: response,
    });
  }
};

/**
 *addLabfile of a given subject
 * requires dept(from token) and files which is an array with name of the labfiles
 * files:{fileNames:["name1","name2"],subcode:IT301}
 * check whether the teacher is really assigned the subject sent in the request
 * @param {*} req
 * @param {*} res
 */
module.exports.addLabFiles = async (req, res) => {
  let response, isError, devErr;
  const { body } = req;
  const { dept } = body.data;
  const { files } = body;
  console.log(files);
  const fileNames = files.fileNames;
  const subcode = files.subcode;

  if (
    !files ||
    isEmpty(fileNames) ||
    !subcode ||
    !checkSubcode(subcode, dept)
  ) {
    response = {
      code: 200,
      msg: "please enter correct input!!",
    };
    res.status(response.code).json(response);
    return await log({ response });
  }

  /* fileNames will also have an id to recognize the no of the file */
  try {
    const dbResult = await TeacherModel.addLabFiles(dept, subcode, fileNames);
    if (dbResult) {
      response = {
        msg: "labfiles added successfully",
        code: 200,
      };
    } else {
      response = {
        msg: errMessage,
        code: 500,
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

/*  need to have dept of teacher(token) email for(verified object)
    and sem in which teacher teaches
*/
module.exports.getUnverifiedStudents = async (req, res) => {
  let response, isError, devErr;
  const { body } = req;
  const { dept, email } = body.data;
  try {
    const dbResult = await TeacherModel.getUnverifiedStudents(dept, email);
    if (dbResult === "NO_SEM") {
      response = {
        code: 200,
        msg: "You are not assigned any semester",
      };
      res.status(response.code).json(response);
      return log({ response });
    } else {
      response = {
        code: 200,
        unverifiedStudents: dbResult,
      };
    }
  } catch (error) {
    isError = true;
    devErr = error;
    resposne = {
      code: 500,
      msg: errMessage,
    };
  } finally {
    console.log(this);
    console.log("error in teacher_c controller" + devErr);
    res.status(response.code).json(response);
    return await log({ response, isError, devErr });
  }
};

module.exports.assignDueDateToLabFile = async (req, res) => {};

module.exports.getSubjectsAssigned = async (req, res) => {
  let { dept, email } = req.body.data;
  let isError, response, devErr;
  try {
    let result = await TeacherModel.getSubjectsAssigned(dept, email);
    if (!isArray(result)) {
      response = {
        error: true,
        code: 500,
        msg: errMessage,
      };
    } else response = { code: 200, teaches, error: false };
  } catch (error) {
    isError = true;
    devErr = error;
    response = {
      error: true,
      code: 500,
      msg: errMessage,
    };
  } finally {
    res.status(response.code).json(response);
    return log({ response, isError, devErr });
  }
};
