const lognsend = require("../util/log").log;
const jwtUtil = require("../util/token_util");

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
			if (error.message === "invalid signature") {
				response = {
					userErr: "Please login again,token expired",
					code: 403
				}
			} else {
				isError = true;
				devErr = error;
				response = {
					msg: errMessage,
					code: 500
				}
			}
			res.status(response.code).json(response);
			return await lognsend({
				response,
				isError,
				devErr
			})
		}
	} else {
		response = {
			code: 403,
			error: false,
			userErr: "you are not logged in",
		}
		res.status(response.code).json(response);
		return await lognsend({
			response
		});
	}
};

module.exports.midError = (req, res, next) => {
	process.on("uncaughtException", (req, res) => {
		console.log("inside midError");
		return res.send("error");
	});
	next();
};

// to do how you let user login as hod

// module.exports.configured = (req, res) => {
//   if (!isConfigured) {
//     return res.redirect("/auth/login_user");
//   }
//   next();
// };