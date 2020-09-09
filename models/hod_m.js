const dbConnection = require("../util/db_util");
const User = require("./user_m");
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

class hod {
	/**
	 *
	 *
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
				result = await db.collection(user).find({
					verified: false,
					dept
				}, {
					projection: {
						_id: 1,
						name: 1
					}
				});
			} else {
				user = "teachers";
				result = await db.collection(user).find({
					verified: false,
					dept
				}, {
					projection: {
						_id: 1,
						name: 1
					}
				});
			}
			let users = [];
			for await (let doc of result) {
				doc.email = doc._id;
				delete doc._id;
				users.push({
					...doc,
				});
			}
			await result.close();
			return users;
		} catch (error) {
			// console.log("line number is ", error.lineNumber);
			console.log(error)
			throw new Error(error);
		}
	}
	/**
	 *
	 *
	 * @static
	 * @param {string} email
	 * @returns true/false whether method verified user or not throws an error
	 * @memberof hod
	 */
	static async verifyUser(email, userType) {
		db = !db ? await dbConnection() : db;
		let user = null;
		const query = db.collection(user).findOneAndUpdate({
			_id: email
		}, {
			$set: {
				verified: {
					verifiedBy: "hod"
				}
			}
		});
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
		[subjects:[{subCode:IT101,subName:sub1}]]
	}
	*/

	static async saveSubjects(dept, semAndSub) {
		try {
			db = !db ? await dbConnection() : db;
			semAndSub.map((ele) => {
				ele.subjects = ele.subjects.map((subjects, subjectNo) => {
					let subCode = dept + (ele.sem).toString() + "0" + (subjectNo + 1).toString();
					return {
						subCode,
						subName: subjects
					};
				});
			});
			// console.log(semAndSub);
			const result = await db.collection("curriculum").insertOne({
				_id: dept,
				curriculum: semAndSub
			});
			return result ? true : false;

		} catch (error) {
			if (error.message === `E11000 duplicate key error collection: ${DB_NAME}.curriculum index: _id_ dup key: { _id: ${dept} }`) {
				return "ALREADY_EXISTS"
			}
			throw new Error(error);
		}

	}
}

module.exports = hod;