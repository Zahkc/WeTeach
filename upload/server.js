var express =   require("express");
var multer  =   require('multer');
var randomstring = require("randomstring");

const https = require('https');
const fs = require('fs');
const virtualhost = fs.readFileSync(__dirname + "/servername.txt");
const privateKey = fs.readFileSync('/etc/letsencrypt/live/${virtualhost}/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/${virtualhost}/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/${virtualhost}/chain.pem', 'utf8');

const options = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

var filename = "";


var app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // require cors

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../data');
  },
  filename: function (req, file, callback) {
	filename = file.originalname + randomstring.generate(5)+".mp4"
    callback(null, filename);
  }
});
var upload = multer({ storage : storage}).single("files");

app.get('/',function(req,res){
      res.sendFile(__dirname + "/upload.html");
});


	app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.json({ success: 0, message: "Error"});
        }
        res.json({ success: 1, message: "Success", href: filename, contentType: "application/mp4"});
    });
});

https.createServer(options,app).listen(5002,function(){
    console.log("HTTPS Upload handler is running on port 5002");
});
