
const { MongoClient } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb://wtapp:wtapp@localhost?serverSelectionTimeoutMS=25000";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
useNewUrlParser: true,
});

var dbo;

module.exports = {
	connectDatabase: async function (callback) {
	console.log("Connecting to MongoDB database");
		try {
			client.connect()
		}
		catch (e) {
			console.error(e);
		}
		dbo = client.db("weteach_live");
		return (dbo === undefined ? false : true);
	},
	getDatabase: function()	{ return dbo;},
};

// Export connect() and session() (get database object) methods


// require our mongodb connection driver
