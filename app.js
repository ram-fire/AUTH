//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const md5=require("md5");


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
    const newUser=new user({
        email:req.body.username,
        password:md5(req.body.password)
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
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",function(req,res){
    user.findOne({email:req.body.username},function(err,foundUser){
        if(!err)
        {
            if(foundUser)
            {
                if(foundUser.password===md5(req.body.password))
                {
                    console.log("logged in")
                    res.render("secrets");
                }
                else
                {
                console.log("wrong password");
                res.render("login");
                }
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