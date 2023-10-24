var express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
const path = require('path');
var form = require('multer');
const { json } = require("body-parser");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const ip='127.0.0.1';
const port='4040';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.text({ type: 'text/html' }));

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST']
}));

app.use(
    express.urlencoded({
        extended: true
    }));

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

var server = app.listen(process.env.PORT || 4040, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
    console.log(`server running at http://${ip}:${port}/`);
});

var dbConfig = {
    user: "sa",
    password: "Kratos23&",
    server: "LAPTOP-SD0K1OUI",
    database: "Node",
    synchronize: true,
    trustServerCertificate: true,
    port: 1433,
    dialectOptions:{
        instanceName: "SQLEXPRESS2019"
    }
};

var items = [];
var item = [];
var items2 = [];
var item2 = [];

app.get("/", function(req,res)
{
    var query = "select * from Studentinfo";

    sql.connect(dbConfig, function(err){

        if (err) console.log(err);

        var request = new sql.Request();

        request.query(query, function(err, recordset)
        {
            if (err) console.log(err)
            for(let [key, value] of Object.entries(recordset))
            {
                //console.log('key: ' + key.json);
                if(key === "recordset"){
                    items = [];
                    for(var i=0; i<value.length; i++){
                        item = [];
                        //console.log('id: ' + value[i].ID + ' name: ' + value[i].Name + ' age: ' + value[i].Age );
                        item['id'] = value[i].ID;
                        item['name'] = value[i].Name;
                        item['age'] = value[i].Age;
                        items.push(item) ;
                    }
                } else {
                    //console.log('not a record');
                }
            }
            console.log('-------------');
            res.render('index', {title:'items',items: items});
            res.end;
        });
    });
});

app.post("/user", function(req,res){
    userid = req.body["dropDown"];

    var query = "select * from Studentinfo where ID = " +"'"+ userid[0] +"'";
    
    sql.connect(dbConfig, function(err){
        if(err) console.log(err);

        var request = new sql.Request();

        request.query(query, function(err, recordset){
            if (err) console.log(err)
            for(let [key, value] of Object.entries(recordset)){
                if(key === "recordset"){
                    items = [];
                    for(var i=0; i<value.length; i++){
                        item = [];
                        item['id'] = value[i].ID;
                        item['name'] = value[i].Name;
                        item['age'] = value[i].Age;
                        items.push(item);
                    }
                } else {
                    //console.log('not a record');
                }
            }
            if (items.length > 0){

            } else{

            }
            res.render('table', {title:'items', items: items});
            res.end;
        });
    });
});


// //PUT API
//app.put("/api/user/:id", function(req , res){
  //  userName = req.body["nameInput"];
    //userAge = req.body["ageInput"];

    //var query = "INSERT INTO Studentinfo (name, address) VALUES (" + userName + "," + userAge +")";
    
    //console.log(query);
//});

// // DELETE API
//  app.delete("/api/user /:id", function(req , res){
//                 var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
//                 executeQuery (res, query);
// });