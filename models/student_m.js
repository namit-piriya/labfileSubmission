// importing db connection
const User = require("./user_m");
const dbConnection = require("../util/db_util");
const getSemAndYear = require("../util/gen_util").getSemAndYear;
const hashUtil = require("../util/hash_util");
const _ = require("lodash");

// this will hold the connection
let db;
module.exports = class Student {
  constructor(name, email, enrollno, password, dept) {
    this.name = name;
    this.email = email;
    this.dept = dept;
    this.enrollno = enrollno;
    this.password = password;
    this.verified = false;
  }
  // inserting data into db of user
  async registerStudent() {
    try {
      let result;
      db = !db ? await dbConnection() : db;
      result = await db.collection("students").findOne({
        $or: [
          {
            _id: this.email,
          },
          {
            enrollno: this.enrollno,
          },
        ],
      });

      if (result !== null) return "EMAIL_EXISTS";
      else {
        const { sem, year } = getSemAndYear(this.enrollno);
        debugCon(sem, year);
        console.log(sem, year);
        if (!getSemAndYear(this.enrollno)) return false;
        let hashedPass = await hashUtil.hashPass(this.password);
        debugCon("after hashpass");
        result = await db.collection("students").insertOne({
          tokens: [],
          name: this.name,
          _id: this.email,
          dept: this.dept,
          enrollno: this.enrollno,
          semester: sem,
          year: year,
          password: hashedPass,
          verified: false,
        });
        console.log(result);
        debugCon("after insertion");
        return true;
      }
    } catch (error) {
      // console.log(error)
      throw new Error(error);
    }
  }

  static async loginStudent(email, password) {
    try {
      let result;
      result = await User.loginUser(email, password, "students");
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async verifyStudent(email, verifiedBy) {
    try {
      let result;
      result = await User.verifyUser(email, verifiedBy, "students");
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
};
