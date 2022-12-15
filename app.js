const express = require("express");
const client = require("mailchimp-marketing");

require("dotenv").config();

var app = express();
app.use(express.urlencoded({ extended: true }));

// app.use(express.static('public'));
app.use(express.static(__dirname));

// Configuração/autenticação
client.setConfig({
  apiKey: process.env.API_KEY,
  server: "us9",
});
const listId = process.env.LIST_ID;

// Get requisitions done to the root, directed for signup.html
app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // Create object with the information obtained from the request body
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  const run = async () => {
    const response = await client.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
      }
    })
    //dont occur any errors
    .then(function(response){
      res.sendFile(__dirname+"/sucess.html");
    })
    //if we get an error
    .catch(function(error){
      res.sendFile(__dirname+"/failure.html");
    });
    //console.log(response); // (optional)
  };
  // call async func
  run();
});

// listen to heroku port OR local port
app.listen(process.env.PORT || 3000, function(){
  console.log("Server running...");
});
