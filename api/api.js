const yenv = require('yenv');
const config = yenv(__dirname+'/config.yaml');
const PRESENTER_KEY = config.PRESENTER_KEY;
const ATTENDEE_KEY = config.ATTENDEE_KEY;

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const graph = express.Router();

// Connection file to MONGODB
const dbo = require("./mddl");
const fs = require('fs');

const ObjectId = require("mongodb").ObjectId
const ISODate = require("mongodb").ISODate

// Authenication JWT for protected methods
const auth = require("./auth");

// 1. ALL RECORDS

// Get All Records
graph.route("/api/v1/records").get(auth, async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({}, {username:0, password: 0}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Single Record
graph.route("/api/v1/records/:id").get(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id) };
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").findOne(db_query, {username:0, password: 0}).then((data) => {res.json(data)}).catch((e) => console.log(e));;
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Hard Delete Record
graph.route("/api/v1/records/:id").delete(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id) };
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").deleteOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// 2. USERS
// Only /api/v1/users/.public does not require authentication
// Get All Users
graph.route("/api/v1/users").get(auth, async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "USER"},{username:0, password: 0}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Single User
graph.route("/api/v1/users/:id").get(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "USER" };
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").findOne(db_query,{username:0, password: 0}).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Get Anonymous Login User
graph.route("/api/v1/users/.public").get(async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({ ssid: "public"}, {username:0, password: 0}).then((data) => {res.json(data)}).catch((e) => console.log(e));
});


// Get User by WMID
graph.route("/api/v1/users/.wmid/:wmid").get(auth, async function (req, res) {
	let db_query = { wmid: req.body.wmid, type: "USER" };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find(db_query, {username:0, password: 0}).then((data) => {res.json(data)}).catch((e) => console.log(e));
});


// New user
graph.route("/api/v1/users").post(auth, async function (req,res) {
 try {
	let timestamp = new Date();
	let db_insert = {
		type: "USER",
		name: req.body.name,
		description: req.body.description,
		createdBy: 0,
		createdDateTime: timestamp,
		lastModifiedBy: 0,
		lastModifiedDateTime: timestamp,
		wmid: req.body.wmid,
		mask: 6,
		purged: 0,
		locked: 0
	}
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").insertOne(db_insert).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e); res.end(e);}
});

// Link user with WeMaster ID
graph.route("/api/v1/users/:id/link").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "USER" };
		let timestamp = new Date();
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				wmid: req.body.wmid,
				lastModifiedBy: 0
			},
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Make attendee
graph.route("/api/v1/users/:id/grant/attendee").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "USER" };
		let timestamp = new Date();
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				purged: 0,
				mask: 2,
				lastModifiedBy: 0
			},
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Make presenter
graph.route("/api/v1/users/:id/grant/presenter").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "USER" };
		let timestamp = new Date();
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				purged: 0,
				mask: 0,
				lastModifiedBy: 0
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Disable User. Can be reversed by granting Presenter or Attendee role
graph.route("/api/v1/users/:id").delete(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", locked: 0, purged: 0};
		let timestamp = new Date();
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				purged: 1,
				locked: 1,
				mask: 7,
				lastModifiedBy: 0
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// 3. CHANNELS
// Only /api/v1/channels/.default does not require authentication
// Get All Channels
graph.route("/api/v1/channels").get(auth, async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "CHANNEL", purged: 0}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Channels (Search)
graph.route("/api/v1/channels/search").get(auth, async function (req, res) {
 try {
	let db_query = req.query.q;
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "CHANNEL", purged:0, $text: {$search: db_query} }).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e); res.end(e);}
});

// Get Default Channel
graph.route("/api/v1/channels/.default").get(async function (req,res) {
	let db_connect = dbo.getDatabase()
	db_connect.collection("records").find({ssid: "all-streams"}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Single Channel
graph.route("/api/v1/channels/:id").get(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").findOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// New channel
graph.route("/api/v1/channels").post(auth, async function (req,res) {
	let timestamp = new Date();
	let db_insert = {
		type: "CHANNEL",
		name: req.body.name,
		description: req.body.description,
		createdBy: 0,
		createdDateTime: timestamp,
		lastModifiedBy: 0,
		lastModifiedDateTime: timestamp,
		storage_location: "/weteach/data",
		purged: 0,
		locked: 0
	}
	let db_connect = dbo.getDatabase();
 db_connect.collection("records").insertOne(db_insert).then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Update channel
graph.route("/api/v1/channels/:id").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", locked: 0, purged: 0};
		let timestamp = new Date();
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				name: req.body.name,
				description: req.body.description,
				lastModifiedBy: 0
			}
		};
		let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Soft Delete channel. This can only reversed by mongosh
graph.route("/api/v1/channels/:id").delete(auth, async function (req, res) {
	try {
		var hex = /[0-9A-Fa-f]{24}/g;
		if(hex.test(req.params.id))
		{
			let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", locked: 0, purged: 0};
			let timestamp = new Date();
			let db_update = {
				$currentDate: {
					lastModifiedDateTime: true
				},
				$set: {
					purged: 1,
					locked: 1,
					lastModifiedBy: 0
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
			}
		else
		{
			res.status(400).send("Malformed request");
		}
 }
 catch (e){console.log(e); res.end(e);}
});

// 4. MEDIA
// GET functions do not require token authentication
// Get All Media
graph.route("/api/v1/media").get(async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "MEDIA", purged: 0}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Media (Search)
graph.route("/api/v1/media/search").get(async function (req, res) {
	let db_query = req.query.q;
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "MEDIA", purged: 0, $text: {$search: db_query} }).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Single Media Item
graph.route("/api/v1/media/:id").get(async function (req, res) {
	try {
		var hex = /[0-9A-Fa-f]{24}/g;
		if(hex.test(req.params.id))
		{
			let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA"};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").findOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
		else
		{
			res.status(400).send("Malformed request");
		}
 }
 catch (e){console.log(e); res.end(e);}
});

// New media, for creating live stream object
graph.route("/api/v1/media").post(auth, async function (req,res) {
	let timestamp = new Date();
	let start = new Date(req.body.startDateTime);
	let db_insert = {
		type: "MEDIA",
		name: req.body.name,
		description: req.body.description,
		createdBy: req.body.user,
		createdDateTime: timestamp,
		lastModifiedBy: req.body.user,
		lastModifiedDateTime: timestamp,
		videoConferenceId: 0,
		allowMeetingChat: 1,
		startDateTime: start,
		liveStatus: 0,
		purged: 0,
		locked: 0
	}
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").insertOne(db_insert).then((data) => {res.json(data)}).catch((e) => console.log(e));


});

// New media, second endpoint for video upload
graph.route("/api/v1/media/upload").post(auth, async function (req,res) {
	let timestamp = new Date();
	let start = new Date(req.body.startDateTime);
	let db_insert = {
		type: "MEDIA",
		name: req.body.name,
		description: req.body.description,
		createdBy: req.body.user,
		createdDateTime: timestamp,
		lastModifiedBy: req.body.user,
		lastModifiedDateTime: timestamp,
		videoConferenceId: 0,
		allowMeetingChat: 0,
		startDateTime: start,
		uploadSignature: req.body.href,
		liveStatus: 2,
		purged: 0,
		locked: 0,
		src:
		[
			{
				trackName: "video",
				href: req.body.href,
				contentType: req.body.contentType
			}
		],
		transcript: 'blank.txt'
	}
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").insertOne(db_insert).then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Update media
graph.route("/api/v1/media/:id").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let start = new Date(req.body.startDateTime);
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0};
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				name: req.body.name,
				description: req.body.description,
				startDateTime: start,
				lastModifiedBy: req.body.user
			},
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Soft Delete media. This can only reversed by mongosh
graph.route("/api/v1/media/:id").delete(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0, purged: 0};
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				liveStatus: 4,
				allowMeetingChat: 0,
				purged: 1,
				locked: 1,
				lastModifiedBy: req.body.user
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// 5. STREAMS

// Special Endpoint for START STREAM (GO LIVE)
// Make sure to call POST /api/v1/media first to populate the other stream details
// Modify the value of href and contenttype to match output from Janus

graph.route("/api/v1/media/:id/stream/start").post(auth, async function (req, res) {
try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", liveStatus: 0, locked: 0, purged: 0};
		let roomId = req.body.VCID;
		let adjacentroomId = roomId + 1;
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				liveStatus: 1,
				videoConferenceId: req.body.VCID,
				purged: 0,
				locked: 1,
				transcript: req.body.VCID + '_transcript.txt',
				lastModifiedBy: req.body.user,
			},
			$addToSet: {
				src: {
					$each: [ {
						trackName: "audio",
						href: "rec"+roomId + "-audio-0.mjr",
						contentType: "application/mjr"
					},
					{
						trackName: "video1",
						href: "rec"+roomId + "-video-1.mjr",
						contentType: "application/mjr"
					},
					{
						trackName: "video2",
						href: "rec"+roomId + "-video-2.mjr",
						contentType: "application/mjr"
					}

					]
				}
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Special Endpoint for END STREAM. This is required to unlock the stream details for editing and to set the live stream as finished

graph.route("/api/v1/media/:id/stream/end").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", liveStatus: 1, purged: 0};
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				liveStatus: 3,
				purged: 0,
				locked: 0,
				lastModifiedBy: req.body.user
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});
// Reset Stream
graph.route("/api/v1/media/:id/stream/reset").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", liveStatus: 1, purged: 0};
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				liveStatus: 0,
				purged: 0,
				locked: 0,
				lastModifiedBy: 0
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// This logic is captured in START stream but is here in case you need to manually create NFO files.
graph.route("/api/v1/media/:id/stream/filegen").post(auth, async function (req, res) {
try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		try {
		let timestamp =  new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

		let roomId = req.body.VCID;
		let adjacentroomId = roomId + 1;

			var nfofilex = fs.createWriteStream("../data/"+roomId + ".nfo", {
				flags: 'a'
			})

			nfofilex.write("["+roomId+"] \n");
			nfofilex.write("name = STREAM" + roomId +"\n");
			nfofilex.write("date = " + timestamp+"\n");
			nfofilex.write("audio = " + roomId+"-audio-0.mjr\n");
			nfofilex.write("video = " + roomId+"-video-1.mjr\n");

			var nfofiley = fs.createWriteStream("../data/"+adjacentroomId + ".nfo", {
				flags: 'a'
			})

			nfofiley.write("["+adjacentroomId+"] \n");
			nfofiley.write("name = STREAM" + roomId +"\n");
			nfofiley.write("date = " + timestamp+"\n");
			nfofiley.write("video = " + roomId+"-video-2.mjr\n");
			res.status(200).send("Success");
		}
		catch(e){res.status(500).send("Server error"); // lodge permissions error
	}
 }
 else
 {
	 res.status(400).send("Malformed request");
 }
}
catch (e){console.log(e); res.end(e);}
});


// Update transcript to a custom file
graph.route("/api/v1/media/:id/transcript").post(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0, purged: 0};
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				transcript: req.body.transcript,
				lastModifiedBy: req.body.user
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Remove transcript
graph.route("/api/v1/media/:id/transcript").delete(auth, async function (req, res) {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA"};
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				transcript: 'blank.txt',
				lastModifiedBy: req.body.user
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// 6. PUSH Functions
// Push a discipline onto a channel. This is required for discipline dropdowns
graph.route("/api/v1/channels/:id/disciplines").post((req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
		let db_content = req.body.discipline
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$addToSet: {
					disciplines: {$each: db_content},
				},
				$set: {
					lastModifiedBy: req.body.user
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}

});

// Push a media onto a channel. This is required for searching content
graph.route("/api/v1/channels/:id/media").post((req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
		let db_content = req.body.media
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$addToSet: {
					media: {$each: db_content}
				},
				$set: {
					lastModifiedBy: req.body.user
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Push a presenter onto a channel.
graph.route("/api/v1/channels/:id/presenters").post(auth, (req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
		let db_content = req.body.user
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$addToSet: {
					presenters: {$each: db_content}
				},
				$set: {
					lastModifiedBy: 0
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Push an attendee onto a channel.
graph.route("/api/v1/channels/:id/presenters").post(auth,(req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
		let db_content = req.body.user
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$addToSet: {
					attendees: {$each: db_content}
				},
				$set: {
					lastModifiedBy: 0
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Push an discipline onto a media object
graph.route("/api/v1/media/:id/disciplines").post((req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0, purged: 0};
		let db_content = req.body.discipline
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$addToSet: {
					disciplines: {$each: db_content}
				},
				$set: {
					lastModifiedBy: req.body.user
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Override disciplines array
graph.route("/api/v1/media/:id/disciplines/replace").post((req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0, purged: 0};
		let db_content = req.body.discipline

			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$set: {
					lastModifiedBy: req.body.user,
					disciplines: db_content
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// 7. PULL Functions

// Pull a discipline from a channel.
graph.route("/api/v1/channels/:id/disciplines").delete((req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};

		let db_content = req.body.discipline
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$addToSet: {
					disciplines: {$in: db_content}
				},
				$set: {
					lastModifiedBy: req.body.user
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Pull a media onto a channel. This is required for searching content
graph.route("/api/v1/channels/:id/media").delete((req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
		let db_content = req.body.media
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$pull: {
					media: {$in: db_content}
				},
				$set: {
					lastModifiedBy: req.body.user
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Pull a presenter from a channel.
graph.route("/api/v1/channels/:id/presenters").delete(auth, (req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};
		let db_content = req.body.user
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$pull: {
					presenters: {$in: db_content}
				},
				$set: {
					lastModifiedBy: 0
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Pull an attendee from a channel.
graph.route("/api/v1/channels/:id/attendees").delete(auth, (req, res) => {
try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
	 let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};
	 let db_content = req.body.user
	 if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$pull: {
					attendees: {$in: db_content}
				},
				$set: {
					lastModifiedBy: 0
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Pull an discipline from a media object
graph.route("/api/v1/media/:id/disciplines").delete((req, res) => {
 try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
		{
		let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA"};
		let db_content = req.body.media
		if(!(typeof db_content === "undefined"))
		{
			if (!(db_content instanceof Array))
			{
				db_content = Array(db_content);
			}
			let db_update = {
				$currentDate: {
					lastModified: true
				},
				$pull: {
					disciplines: {$in: db_content}
				},
				$set: {
					lastModifiedBy: req.body.user
				}
			};
			let db_connect = dbo.getDatabase();
			db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
		}
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// 8 AUTH ENDPOINTS
// Add a username and password
graph.post("/api/v1/users/:id/register", auth, async (req, res) => {
try {
	var hex = /[0-9A-Fa-f]{24}/g;
	if(hex.test(req.params.id))
	{
		const { username, password } = req.body;
		if (!(username && password)) {
		  res.status(400).send("Bad Request");
		}
		encryptedPassword = await bcrypt.hash(password, 10);
		let db_query = { _id: new ObjectId(req.params.id), type: "USER", locked:0, purged: 0, ssid:{$exists:false}};
		let db_update = {
			$currentDate: {
				lastModifiedDateTime: true
			},
			$set: {
				username: username.toLowerCase(),
				password: encryptedPassword,
				purged: 0,
				lastModifiedBy: 0
			}
		};
		let db_connect = dbo.getDatabase();
		db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
	}
	else
	{
		res.status(400).send("Malformed request");
	}
 }
 catch (e){console.log(e); res.end(e);}
});

// Login in as attendee. Attendee uses a different key to presenters.
graph.post("/auth/login/attendee", async (req, res) => {

  try {
    const { username, password } = req.body;

	let db_query = { username: req.body.username, type: "USER" };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((user) => {

		if (user && (user.mask === 2) && (bcrypt.compare(password, user.password))) {


			  const token = jwt.sign(
				{ user_id: user._id, username },
				ATTENDEE_KEY,
				{
				  expiresIn: "4h",
				}
			  );

		  user.token = token;
		  user.password = "ENCODED_STRING";

		  res.json(user);
		}
		else
		{
			res.status(401).send("Login failed");
		}
		}).catch((e) => res.status(401).send("Login failed"));

  } catch (err) {
    res.status(400).send("Bad request");
  }

});

// Login in as presenter. Attendee uses a different key to presenters.
graph.post("/auth/login/presenter", async (req, res) => {

  try {
    // Get user input
    const { username, password } = req.body;

	let db_query = { username: req.body.username, type: "USER" };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((user) => {

		if (user && (user.mask === 0) && (bcrypt.compare(password, user.password))) {

			  const token = jwt.sign(
				{ user_id: user._id, username },
				PRESENTER_KEY,
				{
				  expiresIn: "4h",
				}
			  );

		  user.token = token;
		  user.password = "ENCODED_STRING";

		  res.json(user);
		}
		else
		{
			res.status(401).send("Login failed");
		}
		}).catch((e) => res.status(401).send("Login failed"));

  } catch (err) {
    res.status(400).send("Bad request");
  }

});

// Anonymous login
graph.post("/auth/login", async (req, res) => {

  // Our login logic starts here
  try {
	let {username} = "public";
	let db_query = { ssid: "public", type: "USER" };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((user) => {

		if (user.mask === 6) {


			  const token = jwt.sign(
				{ user_id: user._id, username },
				ATTENDEE_KEY,
				{
				  expiresIn: "4h",
				}
			  );
		  user.token = token;

		  res.json(user);
		}
		else
		{
			res.status(401).send("Login failed");
		}
		}).catch((e) => res.status(401).send("Login failed"));

  } catch (err) {
    res.status(400).send("Bad request");
  }

});

// Anonymous login
graph.post("/auth/login/anonymous", async (req, res) => {

  try {
	let {username} = "public";
	let db_query = { ssid: "public", type: "USER" };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((user) => {

		if (user.mask === 6) {

			  const token = jwt.sign(
				{ user_id: user._id, username },
				ATTENDEE_KEY,
				{
				  expiresIn: "4h",
				}
			  );
		  user.token = token;

		  res.json(user);
		}
		else
		{
			res.status(401).send("Login failed");
		}
		}).catch((e) => res.status(401).send("Login failed"));

  } catch (err) {
    res.status(400).send("Bad request");
  }

});

// Root login do not expose over Apache Proxy
graph.post("/auth/login-secure/wtapp", async (req, res) => {

  try {
	let {username} = "wtapp";
	let db_query = { ssid: "wtapp", type: "USER" };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((user) => {

		if (user.mask === 8) {

			  const token = jwt.sign(
				{ user_id: user._id, username },
				PRESENTER_KEY,
				{
				  expiresIn: "4h",
				}
			  );
		  user.token = token;

		  res.json(user);
		}
		else
		{
			res.status(401).send("Login failed");
		}
		}).catch((e) => res.status(401).send("Login failed"));

  } catch (err) {
    res.status(400).send("Bad request");
  }

});


// This should be the last line as it exports all API functions for the server application
module.exports = graph;
