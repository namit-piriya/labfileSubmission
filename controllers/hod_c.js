/* eslint-disable semi */
const hodModel = require('../models/hod_m');
const User = require('../models/user_m');
const TeacherModel = require("../models/teacher_m");
const {
	checkSubcode
} = require('../util/gen_util');
const lognsend = require('../util/log').log;

module.exports.getUnverifiedUsers = async (req, res) => {
	const userType = req.query.user_type;
	const dept = req.body.data.dept;
	let response, result, isError, devErr;
	try {
		if (userType === 'student') {
			result = await hodModel.getUnverified(userType, dept);
			response = {
				students: result,
				code: 200,
			};
		} else if (userType === 'teacher') {
			result = await hodModel.getUnverified(userType, dept);
			response = {
				teachers: result,
				code: 200,
			};
		} else {
			response = {
				userErr: 'any other userType not allowed',
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
		return await lognsend({
			response,
			isError,
			devErr
		});
	}
};

module.exports.verifyUser = async (req, res) => {
	let response, isError, devErr;
	const toVerify = req.params.email;
	console.log(JSON.stringify(req.body));
	const userType = req.query.user_type.trim();
	const {
		email
	} = req.body.data;
	console.log("email is ", email);
	let result;
	try {
		if (userType === 'student') {
			result = await User.verifyUser(toVerify, {
				email,
				role: 'hod'
			}, 'students');
			if (result) {
				response = {
					code: 200,
					msg: 'User Verified'
				};
			}
		} else if (userType === 'teacher') {
			result = await User.verifyUser(toVerify, {
				email,
				role: 'hod'
			}, 'teachers');
			if (result) {
				response = {
					msg: 'User Verified',
					code: 200
				};
			}
		} else {
			response = {
				userErr: 'only teacher and student are user type',
				code: 200
			};
		}

	} catch (error) {
		devErr = error;
		isError = true;
		response = {
			error: true,
			msg: errMessage,
			code: 500
		}
	} finally {
		res.status(response.code).json(response);
		return await lognsend({
			response,
			isError,
			devErr
		})
	}
};
// module.exports.getSubInSem = async (req, res) => {
// };
// module.exports.getUnassignedSubjects = async (req, res) => {
// };


module.exports.saveCurriculum = async (req, res) => {
	let isError, devErr, result, response;
	const {
		body
	} = req;

	const {
		dept
	} = body.data;
	/*
		semAndSub will be an array of object which will be
		{	sem:
			subjects:[]
		}
	*/
	const {
		semAndSub
	} = body;
	// console.log(req.body);
	try {
		result = await hodModel.saveSubjects(dept, semAndSub);
		if (result === "ALREADY_EXISTS") {
			response = {
				code: 200,
				msg: "curriculum already exists"
			}
		} else if (result) {
			response = {
				msg: "Curriculum saved",
				code: 200,
			}
		}
	} catch (error) {
		isError = true;
		devErr = error;
		response = {
			code: 500,
			msg: errMessage
		}
	} finally {
		res.status(response.code).json(response);
		return await lognsend({
			response,
			devErr,
			isError
		});
	}
};

module.exports.generateMarksheet = (req, res) => {

}

module.exports.updateCurriculum = (req, res) => {

}

// console.log("env variable are ", process.env.DB_STRING, process.env.DB);
module.exports.addSubToTeacher = async (req, res) => {
	let response, isError, devErr;
	const {
		body
	} = req;

	const {
		dept
	} = req.body.data;

	const {
		subcode,
		teacherEmail
	} = body;

	if (!checkSubcode(subcode, dept)) {
		response = {
			userErr: "subcode is not valid ",
			code: 200,
		}
	}

	try {
		result = await TeacherModel.addSubject(subcode, teacherEmail);
		if(result === true){
			response = {
				msg:"successfully assigned the subject to given Teacher",
				code:200
			}
		}
	} catch (error) {
		isError = true;
		devErr = {
			error,
			msg: "in the addSubToTeacher"
		};
		response = {
			msg: errMessage,
			code: 500,
		}
	} finally {
		res.status(response.code).json(response);
		await lognsend({
			response,
			isError,
			devErr
		});
	}
}