const dotenv = require("dotenv");
dotenv.config();
// const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const express = require("express");

const log = require("./util/log").log;
const check_init = require("./util/check_init");
const appRouter = require("./routes/app_r");
const authRouter = require("./routes/auth_r");
const studentRouter = require("./routes/student_r");
const teacherRouter = require("./routes/teacher_r");
const hodRouter = require("./routes/hod_r");

global.whereis = process.env.NODE_ENV;
global.errMessage = "something wrong happened please contact admin";
global.debugCon = function (...obj) {
  if (whereis !== "prod") {
    console.log(
      "on date " + new Date().toString() + " object is " + JSON.stringify(obj)
    );
  }
};

// app.use(configured);
const app = express();

// for post requests, parsing body
const bodyParser = require("body-parser");
const { response } = require("express");
const { isError } = require("lodash");

// This will help parsing the body
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// for parsing json data
app.use(bodyParser.json());
app.use(express.json());

app.use(async (err, req, res, next) => {
  console.log("my error handler");
  if (err) {
    console.log(err);
    let isError = true;
    let devErr = err;
    let response = { msg: errMessage, code: 500 };
    res.status(response.code).json();
    return await log({ response, isError, devErr });
  }
  next();
});

// logging with morgan
app.use(morgan("combined"));
// using cors
app.use(cors());

// using routers
app.use("/app", appRouter);
app.use("/auth", authRouter);
app.use("/student", studentRouter);
app.use("/hod", hodRouter);
app.use("/teacher", teacherRouter);

app.all("*", (req, res) => {
  return res.status(404).json({
    msg: "route not available",
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
