var express =   require("express");  
var multer  =   require('multer');  
var randomstring = require("randomstring");
var app =  express();  
app.use(express.json());
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, '../data');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname + randomstring.generate(5)+".mp4");  
  }  
});  
var upload = multer({ storage : storage}).single('myfile');  
   
app.get('/',function(req,res){  
      res.sendFile(__dirname + "/upload.html");  
});   

app.post('/upload',function(req,res){  
    upload(req,res,function(err) {  
        if(err) {  
            return res.end(err);					
        }  
        res.json(req);  
    });  
});  
  
app.listen(5002,function(){  
    console.log("Upload handler is running on port 5002");  
});  