const express = require("express")
const app = express();
const cors = require("cors");

const port = 5000;

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

