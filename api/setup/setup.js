use weteach_live
db.createCollection("records");
db.records.insertOne({
	ssid: "all-streams",
	type: "CHANNEL",
	name: "All Streams",
	description: "Default collection",
	createdBy: 0,
	createdDateTime: new Date(),
	lastModifiedBy: 0,
	lastModifiedDateTime: new Date(),
	storage_location: "/weteach/data",
	purged: 0,
	thumbnails: [    
    {value: "pexels-books.jpg", label: "Books"},
    {value: "pexels-bricks.jpg", label: "Bricks"},
    {value: "pexels-clock.jpg", label: "Clock"},
    {value: "pexels-doughnuts.jpg", label: "Doughnuts"},
    {value: "pexels-headphones.jpg", label: "Headphones"},
    {value: "pexels-jellyfish.jpg", label: "Jellyfish"},
    {value: "pexels-leaves.jpg", label: "Leaves"},
    {value: "pexels-lightning.jpg", label: "Lightning"},
    {value: "pexels-lion.jpg", label: "Lion"},
    {value: "pexels-mountains.jpg", label: "Mountains"},
    {value: "pexels-nebula.jpg", label: "Nebula"},
    {value: "pexels-ocean.jpg", label: "Ocean"},
    {value: "pexels-paradise.jpg", label: "Paradise"},
    {value: "pexels-productivity.jpg", label: "Productivity"},
    {value: "pexels-raindrops.jpg", label: "Raindrops"},
    {value: "pexels-sciencelab.jpg", label: "Science Lab"},
    {value: "pexels-shore.jpg", label: "Shore"},
	{value: "pexels-telescope.jpg", label: "Telescope"},
    {value: "pexels-watercolour.jpg", label: "Watercolour"},
    {value: "pexels-wheatfield.jpg", label: "Wheat Field"}
]
	
	disciplines: ["Animation", "Chemistry", "Economics", "Philosophy", "Physics", "Mathematics", "Communications", "Big Data", "Cybersecurity", "Visual Arts", "Politics", "IT"]
	
	locked: 1
});

db.records.insertOne({
	ssid: "wtapp",
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
	ssid: "public",
	type: "USER",
	name: "Anonymous User",
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
