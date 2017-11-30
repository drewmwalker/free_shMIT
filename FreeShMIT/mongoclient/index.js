var express     = require('express');
var app         = express();
var MongoClient = require('mongodb').MongoClient;

// the name "mongo" comes from the docker link, in the docker-compose.yml
var url = 'mongodb://18.111.108.213:27017/dockerdemo';
var db;

MongoClient.connect(url, function (err, database) {
    if(err){ console.log('failed to connect: ' + err); return;}
    db = database;
    console.log("Connected correctly to server!!");
});

app.get('/', function(req, res){
    res.send('Greetings from the server!!');
});

app.get('/createMongo', function(req, res){ 

    var lat = 1;
    var lng = 2;
    var longitude = lat;
    var latidude = lng;
    var location

    var collection = db.collection('customers');
    var doc = {'longitude':longitude, 'latitute':latitude};
    collection.insert(doc, {w:1}, function(err, result) {
        console.dir(result);
        res.send(result);
    });      
});

app.get('/readMongo', function(req, res){  

    var results = null;    
    var collection = db
        .collection('customers')
        .find()
        .toArray(function(err, docs) {
            console.dir(docs);
            res.send(docs);
    });
});

app.listen(3000);

function printSomething(input){
    console.log(input);
}