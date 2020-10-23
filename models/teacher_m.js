let getDbConnection = require("../util/db_util");
const User = require("./user_m");
const hashUtil = require("../util/hash_util");
const { getSemFromSubcode } = require("../util/gen_util");
let db;

async function dbInit() {
  return (db = !db ? await getDbConnection() : db);
}

class Teacher {
  static async registerTeacher(email, name, password, dept) {
    try {
      let result;
      db = await dbInit();
      result = await db.collection("teachers").findOne({
        _id: email,
      });
      if (result) return "EMAIL_EXISTS";
      // check if a student is trying to register with same email

      result = await db.collection("students").findOne({
        _id: email,
      });

      if (result) return "STUDENT_EMAIL_EXISTS";
      else {
        let hashedPass = await hashUtil.hashPass(password);
        result = await db.collection("teachers").insertOne({
          name: name,
          _id: email,
          dept,
          password: hashedPass,
          verified: false,
          joinedOn: Date.now(),
          teaches: [],
        });
        /*
				teaches ;[
				  {
				    subName:"",
				    subCode:"",
				    sem:
				  }
				]
				 */
        if (result) {
          return true;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async loginTeacher(email, password) {
    try {
      let result;
      result = await User.loginUser(email, password, "teachers");
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async addSubject(subName, subcode, teacherEmail) {
    try {
      db = await dbInit();
      let sem = getSemFromSubcode(subcode);

      const result = await db.collection("teachers").findOneAndUpdate(
        {
          _id: teacherEmail,
        },
        {
          $addToSet: {
            teaches: { subcode, subName, sem },
          },
        }
      );
      // console.log(result);
      if (result.lastErrorObject.n === 1) {
        return true;
      } else false;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async addLabFiles(dept, subcode, fileNames) {
    try {
      db = await dbInit();
      let findResult = await db.collection("subjects").findOne(
        { _id: subcode, dept },
        {
          labFiles: 1,
        }
      );

      // adding Ids to labfiles
      let toInsertId;
      if (findResult.labFiles.length === 0) {
        toInsertId = 1;
      } else {
        toInsertId = findResult.labFiles.length + 1;
      }
      let fileNamesWithIds = fileNames.map((fileName) => {
        return {
          fileName,
          id: toInsertId++,
        };
      });

      let updateResult = await db
        .collection("subjects")
        .findOneAndUpdate(
          { _id: subcode, dept },
          { $addToSet: { labFiles: { $each: fileNamesWithIds } } },
          { upsert: true }
        );
      if (updateResult.lastErrorObject.n === 1) {
        return true;
      } else return false;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getSubjectsAssigned(dept, email) {
    db = await dbInit();
    try {
      let result = await db
        .collection("teachers")
        .findOne(
          {
            _id: email,
            dept,
          },
          {
            projection: {
              teaches: 1,
            },
          }
        )
        .toArray();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Teacher;
