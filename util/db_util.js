const keys = require("../config/keys");
const uri = keys.DB_STRING;
const dbName = keys.DB;
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const mongoPromise = new Promise((res, rej) => {
	if (!dbName)
		throw new Error("db name not recieved!")
	client
		.connect()
		.then((mongo) => {
			res(mongo.db(dbName));
			console.log("connnected to " + dbName);
		})
		.catch((err) => {
			rej("connection problem " + err);
		});
});

let db;
module.exports = async function getDBName() {
	return !db ? await mongoPromise : db;
};