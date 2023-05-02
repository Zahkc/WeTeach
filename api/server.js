const express = require("express");
const https = require('https');
const fs = require('fs');
const app = express();
const cors = require("cors");

const port = 5000;
const privateKey = fs.readFileSync(__dirname +'/privkey.pem', 'utf8');
const certificate = fs.readFileSync(__dirname +'/cert.pem', 'utf8');
const ca = fs.readFileSync(__dirname + '/chain.pem', 'utf8');
const options = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

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
https.createServer(options,app).listen(port, async  () => {
	await dbo.connectDatabase(function(err) {
if (err) console.log(err)
});
	console.log(`Server is running on port: ${port}`)
});

