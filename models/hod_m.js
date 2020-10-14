const dbConnection = require("../util/db_util");
const User = require("./user_m");

const getSemFromSubcode = require("../util/gen_util").getSemFromSubcode;

/*
  no need to be catching  errors here because these methods will be called by controllers 
  so catch error there instead
*/

/*
  one default hod will be there who can set what other teachers will do
	
    what an hod can do:-
    pretty much every thing
    hod can also set semester for particular enrollment no
    a hod can also add and assign roles to teachers and their default subjects,
    their classes
*/
let db;

class HOD {
  /**
   * @static
   * @param {string} userType
   * @returns object containing students or teachers unverified, can be null
   * @memberof hod
   */
  static async getUnverified(userType, dept) {
    try {
      db = !db ? await dbConnection() : db;
      let result;
      let user;
      if (userType === "student") {
        user = "students";
        result = await db.collection(user).find(
          {
            verified: false,
            dept,
          },
          {
            projection: {
              _id: 1,
              name: 1,
            },
          }
        );
      } else {
        user = "teachers";
        result = await db.collection(user).find(
          {
            verified: false,
            dept,
          },
          {
            projection: {
              _id: 1,
              name: 1,
            },
          }
        );
      }
      let users = [];
      for await (let doc of result) {
        let obj = { ...doc };
        obj.email = doc._id;
        delete obj._id;
        users.push({
          ...obj,
        });
      }
      await result.close();
      return users;
    } catch (error) {
      // console.log("line number is ", error.lineNumber);
      console.log(error);
      throw new Error(error);
    }
  }
  /**
   * @static
   * @param {string} email
   * @returns true/false whether method verified user or not throws an error
   * @memberof hod
   */
  static async verifyUser(email, userType) {
    db = !db ? await dbConnection() : db;
    let user = null;
    const query = db.collection(user).findOneAndUpdate(
      {
        _id: email,
      },
      {
        $set: {
          verified: {
            verifiedBy: "hod",
          },
        },
      }
    );
    if (userType === "student") {
      user = "students";
    } else {
      user = "teachers";
    }

    const result = await query;
    if (result.lastErrorObject.n === 1) {
      return true;
    } else {
      return false;
    }
  }
  static async loginhod(email, password) {
    try {
      let result;
      result = await User.loginUser(email, password, "hod");
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
  /*
      semAndSub will be like
      semAndSub = [{
        sem:1
        subjects:[]
      },{
        sem:2
        subjects:[]
      }]
      */
  // form the array so that it contains subcode also, so you will have
  //  deptName(sem)0(subjectNo+1) +1 because of 0 based indexing
  /*
  saved semAndSub (curriculum)
  {
    sem:
    [subjects:[{subcode:IT101,subName:sub1}]]
  }
  */

  // in this version you have to insert all the sem and subject at once
  // to do -- this can be  updated as sem

  /*  also add subjects in a collection
   I can add teacher object in the teacher array so fetching will be easy instead of applying aggregation
    at most every subject will have three teacher I won't run out of my docment storage and won't have to 
    touch another collection
   */
  static async saveSubjects(dept, subjects) {
    let result = null;
    db = !db ? await dbConnection() : db;
    try {
      console.log(JSON.stringify(subjects) + "is subjects");
      const toInsert = subjects.map((subject) => {
        return {
          dept,
          _id: subject.subcode,
          subName: subject.subName,
          labFiles: [],
          assignments: [],
          teachers: [],
          sem: getSemFromSubcode(subject.subcode),
        };
      });
      console.log("toInsert is in saveSubjects " + JSON.stringify(toInsert));
      result = await db.collection("subjects").insertMany(toInsert);
      if (result.insertedCount >= 1) {
        return true;
      } else return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async saveSubjectsInCurriculum(dept, semAndSub) {
    try {
      db = !db ? await dbConnection() : db;
      const subjects = new Set();
      semAndSub.forEach((ele) => {
        let sem = ele.sem;
        ele.subjects = ele.subjects.map((subject, subjectNo) => {
          let subcode =
            dept + ele.sem.toString() + "0" + (subjectNo + 1).toString();
          subjects.add({
            subName: subject,
            subcode,
            sem,
          });
          return {
            subcode,
            subName: subject,
          };
        });
      });

      // console.log(semAndSub);
      const result = await db.collection("curriculum").findOneAndUpdate(
        {
          _id: dept,
        },
        { $addToSet: { curriculum: { $each: semAndSub } } },
        {
          upsert: true,
        }
      );
      console.log("result after insertion ", result);
      console.log(subjects);
      await HOD.saveSubjects(dept, [...subjects]);

      return result.lastErrorObject.n === 1;
    } catch (error) {
      if (
        error.message ===
        `E11000 duplicate key error collection: ${process.env.DB}.curriculum index: _id_ dup key: { _id: ${dept} }`
      ) {
        return "ALREADY_EXISTS";
      }
      throw new Error(error);
    }
  }

  static async infoOfTeachers(dept) {
    try {
      db = !db ? await dbConnection() : db;
      let result = await db
        .collection("teachers")
        .find({ dept }, { projection: { teaches: 1, _id: 1, name: 1 } })
        .toArray();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  // fetch teacher document's teaches and extract those objects which are equal to the given sem
  // but If a subject is not assigned teacher the subject will not be shown
  // so here the good chice will be to fetch from subjects
  // and then fetch teachers from there
  static async getInfoOfSem(dept, sem) {
    try {
      db = !db ? await dbConnection() : db;
      let result = await db
        .collection("subjects")
        .find(
          {
            $and: [{ sem }, { dept }],
          },
          {
            teachers: 1,
            subName: 1,
          }
        )
        .toArray();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = HOD;

// db.curriculum.aggregate([
//   {
//     $unwind: {
//       path: "$curriculum",
//     },
//   },
//   {
//     $match: {
//       "curriculum.sem": { $eq: 1 },
//     },
//   },
//   {
//     $unwind: {
//       path: "$curriculum.subjects",
//     },
//   },
//   {
//     $replaceRoot: { newRoot: "$curriculum" },
//   },
//   {
//     $project: {
//       _id: 0,
//     },
//   },
//   {
//     $lookup: {
//       from: "teachers",
//       localField: "subjects.subcode",
//       foreignField: "teaches.$",
//       as: "teachers",
//     },
//   },
// ]);
