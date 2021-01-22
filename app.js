//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public/'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = process.env.MAILCHIMP;

  const options ={
    method: "POST",
    auth: process.env.MC_AUTH
  };

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

request.write(jsonData);
request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.post("/success", function(req, res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});




// app.listen(3000, function() {
//   console.log("Server is running on port 3000");
// });
