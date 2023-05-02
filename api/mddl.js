
const { MongoClient } = require("mongodb");
// Replace the placeholder with your Atlas connection string

// Mac or Linux config
const uri = "mongodb://localhost?serverSelectionTimeoutMS=25000";
// Windows
const win32uri = "mongodb://127.0.0.1";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
useNewUrlParser: true,
useUnifiedTopology: true
});

const win32client = new MongoClient(win32uri, {
useNewUrlParser: true,
useUnifiedTopology: true
});

var dbo;

module.exports = {
	connectDatabase: async function (callback) {
		// check if running on Windows, else use the Linux client
		if(process.platform == "win32")
		{
			try {
			
				console.log("Connecting to " + win32uri);
				win32client.connect()					
			}
			catch (e) {
				console.error(e);
			}
			dbo = win32client.db("weteach_live");
		}
		else
		{
			try {
	
					console.log("Connecting to " + uri);
					client.connect()
				}
	
			catch (e) {
				console.error(e);
			}
			dbo = client.db("weteach_live");
			
		}
		
		return (dbo === undefined ? false : true);
	},
	getDatabase: function()	{ return dbo;},
};

// Export connect() and session() (get database object) methods


// require our mongodb connection driver
