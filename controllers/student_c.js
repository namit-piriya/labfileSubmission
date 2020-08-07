const StudentModel = require("../models/student_m");
const {
	isEmpty
} = require("lodash");
const lognsend = require("../util/log").log;
const checkEmail = require("../util/gen_util").checkEmail;
const checkPass = require("../util/gen_util").checkPass;

exports.registerStudent = async (req, res) => {
	let isError;
	let devErr;
	const {
		body
	} = req;
	const {
		email,
		name,
		password,
		enrollno,
		dept
	} = body;
	let resultObj;

	debugCon({
		email,
		name,
		password,
		enrollno,
		dept
	});

	if (isEmpty(checkEmail(email))) {
		resultObj = {
			userErr: "please Provide valid  email",
			code: 400,
		};
		return await lognsend(resultObj);
	}

	if (isEmpty(checkPass(password))) {
		resultObj = {
			userErr: "please Provide valid password",
			code: 400,
		};
		return await lognsend(resultObj);
	}

	if (!email || !password | !enrollno || !dept || !name) {
		resultObj = {
			userErr: "please Provide valid input or email",
			code: 400,
		};
		return await lognsend(resultObj);
	}
	const student = new StudentModel(name, email, enrollno, password, dept);
	let result, obj;
	try {
		result = await student.registerStudent();
		if (result === true) {
			obj = {
				code: 200,
				error: false,
				msg: "registration successful, procceed with verification.",
			};
		} else if (result == false) {
			obj = {
				code: 200,
				error: false,
				msg: "please contact to hod about your sem and year"
			}
		} else if (result === "EMAIL_EXISTS") {
			obj = {
				code: 400,
				userErr: "Email already exists.",
			};
		} else {
			debugCon("result is ", result);
		}
	} catch (error) {
		isError = true;
		devErr = error;
		obj = {
			code: 500,
			error: true,
			msg: "please contact to admin"
		}
	} finally {
		res.status(obj.code).json(obj);
		await lognsend({
			responseObj: obj,
			isError,
			devErr
		});
	}
};