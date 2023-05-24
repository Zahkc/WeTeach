const yenv = require('yenv');
const config = yenv(__dirname+'/config.yaml');
const { MongoClient } = require("mongodb");
// Replace the placeholder with your Atlas connection string



// Mac or Linux config
const MONGODB_LINUX_URL = config.MONGODB_LINUX_URL;
// Windows
const MONGODB_WIN32_URL = config.MONGODB_WIN32_URL;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGODB_LINUX_URL, {
useNewUrlParser: true,
useUnifiedTopology: true
});

const win32client = new MongoClient(MONGODB_WIN32_URL, {
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

				console.log("Connecting to " + MONGODB_WIN32_URL);
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
	
					console.log("Connecting to " + MONGODB_LINUX_URL);
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
