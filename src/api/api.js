
const express = require("express");

const graph = express.Router();
const dbo = require("./mddl");
// Connection file to MONGODB

const ObjectId = require("mongodb").ObjectId
const ISODate = require("mongodb").ISODate

// 1. ALL RECORDS

// Get All Records
graph.route("/api/v1/records").get(async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Single Record
graph.route("/api/v1/records/:id").get(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id) };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));;
 }
 catch (e){console.log(e)}
});

// Hard Delete Record
graph.route("/api/v1/records/:id").delete(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id) };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").deleteOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e) {console.log(e)}
});

// 2. USERS

// Get All Users
graph.route("/api/v1/users").get(async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "USER"}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Single User
graph.route("/api/v1/users/:id").get(async function (req, res) {
	let db_query = { _id: new ObjectId(req.params.id), type: "USER" };
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// New user
graph.route("/api/v1/users").post(async function (req,res) {
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
 catch (e){console.log(e)}
});

// Link user with WeMaster ID
graph.route("/api/v1/users/:id/link").post(async function (req, res) {
 try {
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
 catch (e){console.log(e)}
});

// Make attendee
graph.route("/api/v1/users/:id/grant/attendee").post(async function (req, res) {
 try {
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
 catch (e){console.log(e)}
});

// Make presenter
graph.route("/api/v1/users/:id/grant/presenter").post(async function (req, res) {
 try {
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
 catch (e){console.log(e)}
});

// Disable User. Can be reversed by granting Presenter or Attendee role
graph.route("/api/v1/users/:id").delete(async function (req, res) {
 try {
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
 catch (e){console.log(e)}
});


// 3. CHANNELS

// Get All Channels
graph.route("/api/v1/channels").get(async function (req, res) {	
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "CHANNEL", purged: 0}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Channels (Search)
graph.route("/api/v1/channels/search").get(async function (req, res) {
 try {
	let db_query = "/(^|\W)(?i)"+req.body.query+"(?i).*/";
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "CHANNEL", name: {$regex: db_query}, purged: 0}).toArray() {
 }
 catch (e){console.log(e)}
});

// Get Single Channel
graph.route("/api/v1/channels/:id").get(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// New channel
graph.route("/api/v1/channels").post(async function (req,res) {
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
graph.route("/api/v1/channels/:id").post(async function (req, res) {
 try {
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
 catch (e){console.log(e)}
});

// Soft Delete channel. This can only reversed by mongosh
graph.route("/api/v1/channels/:id").delete(async function (req, res) {
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
});

// 4. MEDIA

// Get All Media
graph.route("/api/v1/media").get(async function (req, res) {
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "MEDIA", purged: 0}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Media (Search)
graph.route("/api/v1/media/search").get(async function (req, res) {
	let db_query = "/(^|\W)(?i)"+req.body.query+"(?i).*/";
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").find({type: "MEDIA", name: {$regex: db_query}, purged: 0}).toArray().then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// Get Single Media Item
graph.route("/api/v1/media/:id").get(async function (req, res) {
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA"};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").findOne(db_query).then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// New media, for creating live stream object
graph.route("/api/v1/media").post(async function (req,res) {
	let timestamp = new Date();
	let db_insert = {
		type: "MEDIA",
		name: req.body.name,
		description: req.body.description,
		createdBy: 0,
		createdDateTime: new ISODate(timestamp),
		lastModifiedBy: req.body.user,
		lastModifiedDateTime: new ISODate(timestamp),
		videoConferenceId: 0,
		allowMeetingChat: 1,
		startDateTime: ISODate(req.body.startDateTime),
		livestatus: 0,
		purged: 0,
		locked: 0
	}
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").insertOne(db_insert).then((data) => {res.json(data)}).catch((e) => console.log(e));
});

// New media, second endpoint for video upload
graph.route("/api/v1/media/upload").post(async function (req,res) {
	let timestamp = new Date();
	let db_insert = {
		type: "MEDIA",
		name: req.body.name,
		description: req.body.description,
		createdBy: 0,
		createdDateTime: new ISODate(timestamp),
		lastModifiedBy: req.body.user,
		lastModifiedDateTime: new ISODate(timestamp),
		videoConferenceId: 0,
		allowMeetingChat: 1,
		startDateTime: ISODate(req.body.startDateTime),
		livestatus: 2,
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
graph.route("/api/v1/media/:id").post(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0};
	let db_update = {
		$currentDate: {
			lastModifiedDateTime: true
		},
		$set: {
			name: req.body.name,
			description: req.body.description,
			startDateTime: ISODate(req.body.startDateTime),
			lastModifiedBy: req.body.user
		},
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Soft Delete media. This can only reversed by mongosh
graph.route("/api/v1/media/:id").delete(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0, purged: 0};
	let db_update = {
		$currentDate: {
			lastModifiedDateTime: true
		},
		$set: {
			livestatus: 4,
			allowMeetingChat: 0,
			purged: 1,
			locked: 1,
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// 5. STREAMS

// Special Endpoint for START STREAM (GO LIVE)
// Make sure to call POST /api/v1/media first to populate the other stream details
// Modify the value of href and contenttype to match output from Janus

graph.route("/api/v1/media/:id/stream/start").post(async function (req, res) {
try {
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", livestatus: 0, locked: 0, purged: 0};
	let db_update = {
		$currentDate: {
			lastModifiedDateTime: true
		},
		$set: {
			livestatus: 1,
			videoConferenceId: req.body.videoConferenceId,
			purged: 0,
			locked: 1,
			transcript: req.body.videoConferenceId + '_transcript.txt',
			lastModifiedBy: 0,
		},
		$push: {
			src: {
				$each: [ { 
					trackName: "audio", 
					href: req.body.videoConferenceId + "_track0.mp4",
					contentType: "video/mp4"
				},
				{ 
					trackName: "video", 
					href: req.body.videoConferenceId + "_track1.mp4",
					contentType: "video/mp4"
				}]
			}
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Special Endpoint for END STREAM. This is required to unlock the stream details for editing and to set the live stream as finished

graph.route("/api/v1/media/:id/stream/end").post(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id), videoConferenceId: req.body.videoConferenceId, type: "MEDIA", livestatus: 1, purged: 0};
	let db_update = {
		$currentDate: {
			lastModifiedDateTime: true
		},
		$set: {
			livestatus: 3,
			videoConferenceId: req.body.videoConferenceId,
			purged: 0,
			locked: 1,
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Update transcript to a custom file
graph.route("/api/v1/media/:id/transcript").post(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0, purged: 0};
	let db_update = {
		$currentDate: {
			lastModifiedDateTime: true
		},
		$set: {
			transcript: req.body.transcript,
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Remove transcript
graph.route("/api/v1/media/:id/transcript").delete(async function (req, res) {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA"};
	let db_update = {
		$currentDate: {
			lastModifiedDateTime: true
		},
		$set: {
			transcript: 'blank.txt',
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});



// 6. PUSH Functions
// Push a discipline onto a channel. This is required for discipline dropdowns
graph.route("/api/v1/channels/:id/disciplines").post((req, res) => {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$push: {
			disciplines: req.body.discipline,
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Push a media onto a channel. This is required for searching content
graph.route("/api/v1/channels/:id/media").post((req, res) => {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$push: {
			media: req.body.media
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Push a presenter onto a channel.
graph.route("/api/v1/channels/:id/presenters").post((req, res) => {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$push: {
			presenters: req.body.user
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
 db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Push an attendee onto a channel.
graph.route("/api/v1/channels/:id/presenters").post((req, res) => {
 try { 
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$push: {
			attendees: req.body.user
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Push an discipline onto a media object
graph.route("/api/v1/media/:id/disciplines").post((req, res) => {
 try {	
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA", locked: 0, purged: 0};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$push: {
			disciplines: req.body.discipline,
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
 db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// 7. PULL Functions

// Pull a discipline from a channel.
graph.route("/api/v1/channels/:id/disciplines").delete((req, res) => {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$push: {
			disciplines: req.body.discipline,
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Pull a media onto a channel. This is required for searching content
graph.route("/api/v1/channels/:id/media").delete((req, res) => {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL", purged: 0};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$push: {
			media: req.body.media
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Push a presenter from a channel.
graph.route("/api/v1/channels/:id/presenters").delete((req, res) => {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$pull: {
			presenters: req.body.user
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Pull an attendee from a channel.
graph.route("/api/v1/channels/:id/presenters").delete((req, res) => {
try { 
 let db_query = { _id: new ObjectId(req.params.id), type: "CHANNEL"};
 let db_update = {
		$currentDate: {
			lastModified: true
		},
		$pull: {
			attendees: req.body.user
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// Pull an discipline from a media object
graph.route("/api/v1/media/:id/disciplines").delete((req, res) => {
 try {
	let db_query = { _id: new ObjectId(req.params.id), type: "MEDIA"};
	let db_update = {
		$currentDate: {
			lastModified: true
		},
		$pull: {
			disciplines: req.body.discipline,
		},
		$set: {
			lastModifiedBy: 0
		}
	};
	let db_connect = dbo.getDatabase();
	db_connect.collection("records").updateOne(db_query, db_update).then((data) => {res.json(data)}).catch((e) => console.log(e));
 }
 catch (e){console.log(e)}
});

// This should be the last line as it exports all API functions for the server application
module.exports = graph
