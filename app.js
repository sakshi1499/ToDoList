//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const _= require("lodash");
//mongoose.set('useFindAndModify', false);
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
mongoose.connect("mongodb+srv://admin-sakshi:test123@cluster0-ywrda.mongodb.net/todolist",{useNewUrlParser : true});
const itemsSchema = new mongoose.Schema({
  name: String
});
let day;
const Item = mongoose.model("Item",itemsSchema);
const itemOne = new Item({
  name:"Get up on time"
});
const itemTwo = new Item({
  name:"Drink Lots of Water"
});
const itemThree = new Item({
  name:"Keep negativity away"
});
const defaultItems = [itemOne, itemTwo, itemThree];
const listSchema = new mongoose.Schema({
  name : String,
  items : [itemsSchema]
});
const List = mongoose.model("List", listSchema);
app.get("/",function(req,res){
let current = new Date();
let options ={
  weekday: "long",
  day: "numeric",
  month: "long"
};
day = current.toLocaleDateString("en-US",options);
Item.find({},function(err,results){
  if(results.length === 0)
  {
    Item.insertMany(defaultItems, function(err){
      if(err)
      {
        console.log(err);
      }
      else
      console.log("Successfully Added");
    });
res.redirect("/");
  }
  else{
    res.render("List", {kindofday : day , newListItems :results});
    }
  });
});
app.get("/:nameEntered",function(req,res){
  const nameEntered = _.capitalize(req.params.nameEntered);
  List.findOne({name : nameEntered},function(err,resultList){
    if(!resultList)
    {
      const list = new List({
        name : nameEntered,
        items : defaultItems
      });
      list.save();
      res.redirect("/" + nameEntered);
  }
    else{
    res.render("list",{kindofday: resultList.name, newListItems: resultList.items});
    }
  })
});
app.post("/",function(req,res){
  let itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name : itemName
  });
  if(listName === day)
  {
  item.save();
  res.redirect("/");
}
else
{
  List.findOne({name : listName},function(err,foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
  });
}

});
app.post("/delete",function(req,res){
  const checkedItemId= req.body.checkbox;
  const listNameInput= req.body.listNameInput;
  if(listNameInput === day)
  {   Item.findByIdAndRemove( checkedItemId, function(err){
      if(!err)
      {console.log("Deleted");
        res.redirect("/");
      }
      });
  }
  else{
      List.findOneAndUpdate({name:listNameInput},{$pull:{items:{_id:checkedItemId}}},{useFindAndModify: false},function(err,resultsList){
      if(!err)
      {
      res.redirect("/"+ listNameInput);
      }
    });
  }
});

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running");
});
