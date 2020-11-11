
const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname+"/date.js")
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");
app.use(express.static("public"))

const allItems = []
const workItems = []


app.get("/",function(req,res){
    

    res.render('list', {listTitle: date, allItems:allItems});
})

app.get("/Work",function(req,res){
    
    res.render('list', {listTitle: "Work", allItems:workItems});
})

app.post("/",function(req,res){
    
    let item = req.body.newItem

    if(req.body.list === 'Work'){
        workItems.push(item);
        res.redirect("/Work");
    }else{
        allItems.push(item )
        res.redirect("/");
    }
})


app.listen(3000, function(){
    console.log("Server Started on Port 3000");
});