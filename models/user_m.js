const dbConnection = require("../util/db_util");
const hashUtil = require("../util/hash_util");
const {
	isEmpty
} = require("lodash");
let db;
class User {
	/**
	 * attempts to match email and password of the user
	 * if return false password is not matched
	 * email:email of the user
	 * password:password of the user
	 * collName:which collection to query
	 * @static
	 * @param {string} email
	 * @param {string} password
	 * @param {string} collName
	 * @returns {object} who verified the user, "NOT_VERIFIED" ,"NO_USER"
	 * @memberof User
	 */
	static async loginUser(email, password, collName) {
		db = !db ? await dbConnection() : db;

		let result = await db.collection(collName).findOne({
			_id: email,
		}, {
			_id: 1,
			dept: 1
		});
		if (result !== null || !isEmpty(result)) {
			if (result.verified === true) {
				const resultBcrypt = await hashUtil.comparePass(
					password,
					result.password
				);
				if (resultBcrypt === true) {
					return result
				}
			} else {
				return "NOT_VERIFIED";
			}
		} else return "NO_USER";
	}

	/**
	 *
	 * collName is name of the collection
	 * verified by is an object that should have name,email and role field conataining who verified the user
	 * @static
	 * @param {string} email
	 * @param {object} verifiedBy
	 * @param {string} collName
	 * @returns true/false
	 * @memberof User
	 */
	static async verifyUser(email, verifiedBy, collName) {
		let result;
		try {
			db = !db ? await dbConnection() : db;
			result = await db.collection(collName).findOneAndUpdate({
				_id: email
			}, {
				$set: {
					verified: {
						verifiedBy,
					},
				},
			});
			// console.log(result)
			if (result.lastErrorObject.n == 1) {
				return true;
			} else return false;
		} catch (error) {
			throw new Error("error in verifyUser " + error);
		}
	}
}

module.exports = User;