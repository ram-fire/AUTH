//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const someOtherPlaintextPassword = 'not_bacon';


mongoose.connect("mongodb://localhost:27017/userDB",
    {useNewUrlParser:true , useUnifiedTopology:true});

const app=express();

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

app.set('view engine',"ejs");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


const user=new mongoose.model("user",userSchema);

app.get("/",function(req,res){
    res.render("home");
});
  
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
  
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser=new user({
            email:req.body.username,
            password:hash
        });
        newUser.save(function(err){
            if(err) console.log(err);
            else
            {
                console.log("added user");
                res.render("secrets");
            }
        });
    });
    
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",function(req,res){
    user.findOne({email:req.body.username},function(err,foundUser){
        if(!err)
        {
            if(foundUser)
            {
                bcrypt.compare(req.body.password,foundUser.password, function(err, result) {
                    if(result)
                    {
                        console.log("logged in");
                        res.render("secrets");
                    }
                    else
                    {
                        console.log("wrong password");
                        res.render("login");
                    }
                });
            }
            else
            {
                console.log("user not found");
                res.render("register");
            }
        }
    });
})





app.listen(3000,function(err){
    if(err) console.log(err);
    else
    {
        console.log("server is running at port 3000 .....");
    }
});