var express = require("express");
var app = express();
var https = require('https');
var http = require('http');
var fs=require('fs');

app.use(express.static('public'));

var port = 3000;
var bodyParser = require('body-parser');
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Added by Drew 11/13/17 as per Abel's SSL video
var options={
    key: fs.readFileSync('drews-key.pem'),
    cert: fs.readFileSync('drews-cert.pem')
};

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var url="mongodb://18.217.62.139:27017/node-demo";

mongoose.connect(url,function(err,database){
    if(err){ console.log('failed to connect: ' + err); return;}
    db = database;
    console.log("Connected correctly to server!!");
});

var nameSchema = new mongoose.Schema({
    itemDescription: String,
    localDescription: String,
    latitude: Number,
    longitude: Number,
    time: String
});
var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/FreeShMIT5.html");
});

app.post("/addedentry", (req, res) => {
    req.body.time=Date();
    var myData = new User(req.body);
  
   myData.save()
        .then(item => {
            //res.send(req.body);
            res.sendFile(__dirname + "/googlemaps.html");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});

app.get("/read",(req,res)=>{
    User.find(function(err,posts){
        if(err) return console.error(err);
        res.send(posts)
    });

    //    var results = null;    
//    var collection = db
//        .collection('customers')
//        .find()
//        .toArray(function(err, docs) {
//            console.dir(docs);
//            res.send(docs);
//    });
});

app.get("/locations",(req,res)=>{
    res.sendFile(__dirname + "/googlemaps.html");
})

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
http.createServer(app).listen(8081,function(){
    console.log('HTTP listening on 8081');
});
https.createServer(options,app).listen(443,function(){
    console.log('HTTPS listening on 443');
});