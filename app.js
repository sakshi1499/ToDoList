//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
let items = ["Get Ready","Eat Food","Drink Water"];
app.get("/",function(req,res){
let current = new Date();
let options ={
  weekday: "long",
  day: "numeric",
  month: "long"
};
let day = current.toLocaleDateString("en-US",options);
res.render("List", {kindofday : day , newListItems :items});
});
app.post("/",function(req,res){
  let item = req.body.newItem;
  items.push(item);
res.redirect("/");
});
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000");
});
