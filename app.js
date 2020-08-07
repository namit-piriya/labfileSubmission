// run this file to run your app with the help of 'node app'
const express = require("express");
const dotenv = require("dotenv");
const check_init = require("./util/check_init");
// const configured = require("./middleware/middleware").configured;
const authRouter = require("./routes/auth_r");
const studentRouter = require("./routes/student_r");
const teacherRouter = require("./routes/teacher_r");
const hodRouter = require("./routes/hod_r");
dotenv.config();

// global.isConfigured = false;
global.whereis = process.env.NODE_ENV;
global.errMessage = "something wrong happened please contact admin"
global.debugCon = function (...obj) {
	if ((whereis !== "prod")) {
		console.log("on date " + new Date().toString() + " object is " + JSON.stringify(obj));
	}
};

// app.use(configured);
const app = express();
// for post requests, parsing body
const bodyParser = require("body-parser");

// This will help parsing the body
app.use(bodyParser.urlencoded({
	extended: true
}));

// for parsing json data
app.use(bodyParser.json())
app.use(express.json());

app.use("/auth", authRouter);
app.use("/student", studentRouter);
app.use("/hod", hodRouter);
app.use("/teacher", teacherRouter);

app.all("*", (req, res) => {
	return res.status(404).json({
		msg: "route not available"
	});
});



// check db and logs util
(async () => {
	await check_init();
})()
.then((result) => {
		const port = process.env.PORT || 8000;
		app.listen(port);
		console.log(`listening on ${port}....`);
	})
	.catch((err) => {
		console.log(err);
		process.exit(1);
	});