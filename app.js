const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const path = require("path")


const app = express();
app.set("views",path.join(__dirname,'views'))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'))

mongoose.connect("mongodb://localhost:27017/cafeDB", {useNewUrlParser:true})

const cafeSchema = new mongoose.Schema({
    name:String,
    location:String,
    description:String,
    map_url:String,
    img_url:String,
    coffee_price:Number,
    seats:String,
    has_sockets:Boolean,
    has_toilet:Boolean,
    has_wifi:Boolean,
    can_take_calls:Boolean,
  })

const Cafe = mongoose.model("Cafe", cafeSchema);

app.get("/cafes", async(req,res)=>{
    const cafes = await Cafe.find({})
    res.render("home", {cafes: cafes});
})

app.get("/cafes/:cafeId",async(req,res)=>{
  const requestedCafeId = req.params.cafeId;
  const cafe = await Cafe.findOne({_id: requestedCafeId})
  res.render("cafeInfo", {cafe:cafe});
})

app.delete("/cafes/:cafeId",async(req,res)=>{
  const id = req.params.cafeId
  const cafe = await Cafe.findByIdAndDelete({_id:id})
  // console.log(cafe)
  res.redirect("/cafes")
})

app.get("/home",function(req,res){
    res.render("landingPage")
})

app.get("/add",function(req,res){
    res.render("addCafe")
})

app.post("/add",(req,res)=>{
    const cafe = new Cafe({
      name:req.body.name,
      location:req.body.location,
      description:req.body.description,
      map_url:req.body.map_id,
      img_url:req.body.img_id,
      coffee_price:req.body.price,
      seats:req.body.seatNo,
      has_sockets:req.body.socket,
      has_toilet:req.body.toilet,
      has_wifi:req.body.wifi,
      can_take_calls:req.body.calls,
    });
    cafe.save()
    // console.log(cafe)
    res.redirect("/cafes")
  })

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });