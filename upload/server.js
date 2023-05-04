var express =   require("express");
var multer  =   require('multer');
var randomstring = require("randomstring");

const https = require('https');
const fs = require('fs');

var newfile = "";

var app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // require cors

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../data/public');
  },
  filename: function (req, file, callback) {
	newfile = file.originalname + randomstring.generate(5)+".mp4"
    callback(null, newfile);
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
        res.json({ success: 1, message: "Success", href: newfile, contentType: "application/mp4"});
    });
});

app.listen(5002,function(){
    console.log("HTTPS Upload handler is running on port 5002");
});
