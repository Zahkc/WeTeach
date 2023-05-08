
const express = require("express");
const https = require('https');
const fs = require('fs');
const app = express();
const cors = require("cors");

require("dotenv").config();

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

app.use(cors()); // require cors
app.use(express.json());
app.use(require("./api")); // all API routes to use this file

const dbo = require("./mddl");
async function main()
{
	await dbo.connectDatabase();
}
dbo.connectDatabase(function (log){ console.log(log)});
app.use(cors({ origin: true, credentials: false }));

app.use(express.json({ extended: false }));
app.listen(port, async  () => {
	await dbo.connectDatabase(function(err) {
if (err) console.log(err)
});
	console.log(`Server is running on port: ${port}`)
});

