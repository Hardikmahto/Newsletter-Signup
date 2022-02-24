//jshint esversion:6


const express= require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https= require("https");
const { futimesSync } = require("fs");
const res = require("express/lib/response");


const app= express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName= req.body.fName;
    const lastName= req.body.lName;
    const email= req.body.email;

    var data= {
        members: [{
            email_address: email,
            status: "unsubscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]};
    var jsonData= JSON.stringify(data);

    var options={
        url="https://us14.api.mailchimp.com/3.0/lists/bd76236535",
        method: "POST",
        headers: {
            "Authorization": "hardik4 0bf70970a4e97677f34623943fcd777a-us14"
        },
    }

    const request = https.request(url,options, function(response){
        if(error){
            res.send("There was an error with signing up, please try again!");
        }else{
            if(response.statusCode=== 200){
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname +"/failure.html");
            }
            response.on("data", function(){
                console.log(JSON.parse(data));
            });
        }
    });   
    request.write(jsonData);
    request.end();

});
 
app.post("/failure", function(){
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});



