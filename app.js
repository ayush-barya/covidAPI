//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/covidDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  Id:{type:String,required:[1,"Id not specified"]},
  Name:{type:String,required:[1,"Name not specified"]},
  DateofBirth:{type:Date,required:[1,"DateofBirth not specified"]},
  PhoneNumber:{type:Number,required:[1,"PhoneNumber not specified"]},
  EmailAddress:{type:String,required:[1,"EmailAddress not specified"]},
  //CreationTimestamp:timestamp
},{ timestamps: true });

const contactSchema =new mongoose.Schema({
  userIdOne:{type:String,required:[1,"userIdOne not specified"]},
  userIdTwo:{type:String,required:[1,"userIdTwo not specified"]},
  check:Number
  //Timestamp:timestamp
},{ timestamps: true });

const User = mongoose.model("User",userSchema);
const Contact = mongoose.model("Contact",contactSchema);



app.get("/users/:userID",function(req,res){
  User.findOne({Id:req.params.userID},function(err,foundUser){
    res.send(foundUser);
  });
});


app.post("/users",function(req,res){
  const newUser = new User({
    Id:                req.body.Id,
    Name:              req.body.Name,
    DateofBirth:       req.body.DateofBirth,
    PhoneNumber:       req.body.PhoneNumber,
    EmailAddress:      req.body.EmailAddress,
    //CreationTimestamp: req.body.CreationTimestamp
  });
  newUser.save(function(err){
    if(!err)
    {
      res.send(newUser);
    }
    else{
      res.send(err);
    }
  });

});

app.post("/contacts",function(req,res){
  const newContact = new Contact({
    userIdOne:  req.body.userIdOne,
    userIdTwo:  req.body.userIdTwo,
    check: 00
    //Timestamp:  req.body.CreationTimestamp
  });

  newContact.save(function(err){
    if(!err)
    {
      res.send(newContact);
    }
    else{
      res.send(err);
    }
  });
});

// app.get("/contacts",function(req,res){
//   const id= req.body.user;
//   const infected_date=req.body.infection_stamp;
//   Contact.find({$or:[{userIdOne:id},{userIdtwo:id}]},'userIdOne userIdTwo', function (err, docs) {
//     console.log(docs);
//   });
//
// });
app.get("/contacts",function(req,res){
  const id= req.body.user;
  const infected_date=req.body.infection_stamp;

  Contact.find({
      $and: [
          { $or: [{userIdOne: id}, {userIdTwo: id}] },
          {14:{$gte:{$divide: [ {$subtraction:[infected_date,"createdAt"]}, 86400000 ]}}}
      ]
  },'userIdOne userIdTwo', function (err, docs) {
    console.log(docs);
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
