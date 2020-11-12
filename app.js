const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");
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

const app = express();

// This will help parsing the body

// for parsing json data
app.use(express.json());

app.use(helmet());
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

app.use((err, req, res, next) => {
  resObj = {
    msg: app.locals.errMessage,
    error: true,
  };
  res.status(500).json(resObj);
  log({
    isError: true,
    error: err,
    response: resObj,
  });
});
// check db and logs util either they are working or not
// If Database connection is not established server will not start
(async () => {
  await check_init();
})()
  .then((_) => {
    const port = process.env.PORT || 8000;
    app.listen(port);
    console.log(`listening on ${port}....`);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
