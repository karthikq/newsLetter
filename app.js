/** @format */

// jshint esversion:6

const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.static("Public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/singup.html");
});

app.post("/", function (req, res) {
  const firstname = req.body.FNAME;
  const lastname = req.body.LNAME;
  const emailaddress = req.body.Email;

  // jsdata that we need to seed to the mailchimp
  const data = {
    members: [
      {
        email_address: emailaddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };
  // coverting to string
  const jsondata = JSON.stringify(data);

  const url = "https://us2.api.mailchimp.com/3.0/lists/54a166c917";

  const options = {
    method: "POST",
    auth: process.env.MAIL_ID,
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  request.write(jsondata);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server in port 3000");
});
