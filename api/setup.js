use weteach_live
db.createCollection("records");
db.records.insertOne({
	type: "CHANNEL",
	name: "All Streams",
	description: "Default collection",
	createdBy: 0,
	createdDateTime: new Date(),
	lastModifiedBy: 0,
	lastModifiedDateTime: new Date(),
	storage_location: "/weteach/data",
	purged: 0,
	locked: 1
});

db.records.insertOne({
	type: "USER",
	name: "System Administrator",
	description: "Root account",
	createdBy: 0,
	createdDateTime: new Date(),
	lastModifiedBy: 0,
	lastModifiedDateTime: new Date(),
	storage_location: "/weteach/data",
	wmid: 0,
	mask: 8,
	purged: 0,
	locked: 1
});
db.records.insertOne({
	type: "USER",
	name: "Anonynmous User",
	description: "Public account",
	createdBy: 0,
	createdDateTime: new Date(),
	lastModifiedBy: 0,
	lastModifiedDateTime: new Date(),
	storage_location: "/weteach/data",
	wmid: 1,
	mask: 6,
	purged: 0,
	locked: 1
});
db.records.createIndex({"name": "text"});
