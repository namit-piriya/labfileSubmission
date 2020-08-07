const TeacherModel = require("../models/teacher_m");
const {
	isEmpty
} = require("lodash");
const lognsend = require("../util/log").log;
const checkEmail = require("../util/gen_util").checkEmail;
const checkPass = require("../util/gen_util").checkPass;

module.exports.registerTeacher = async (req, res) => {

	let isError, response, devErr;
	const {
		body
	} = req;
	const {
		email,
		name,
		password,
		dept
	} = body;

	if (!email || !password || !dept || !name) {
		response = {
			userErr: "please Provide valid input",
			code: 400,
		};
		return await lognsend(response);
	}

	if (isEmpty(checkEmail(email))) {
		response = {
			userErr: "please Provide valid  email",
			code: 400,
		};
		return await lognsend(response);
	}

	if (isEmpty(checkPass(password))) {
		response = {
			userErr: "please Provide valid password",
			code: 400,
		};
		return await lognsend(response);
	}

	let result;
	try {
		result = await TeacherModel.registerTeacher(email, name, password, dept);
	} catch (error) {
		isError = true;
		devErr = error;
		response = {
			code: 500,
			apiCode: "error",
			msg: errMessage,
		}
		res.status(response.code).json(response);
		return await lognsend({
			devErr,
			isError,
			response: response
		});
	}

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
	return await lognsend({
		response: response
	});
};

// module.exports.addNoOfFiles = async (req, res) => {

// };

// module.exports.unverifiedStudents = async (req, res) => {

// };

// module.exports.assignDueDate = async (req, res) => {


// };