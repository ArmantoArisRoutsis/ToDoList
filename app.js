const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname+"/date.js")
const app = express();
const mongoose = require("mongoose")
const _ = require("lodash");
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");
app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin-armanto:6942096892@cluster0.getau.mongodb.net/todolistdb", {useNewUrlParser: true });

const itemsSchema = {
    name: String
}

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

const Item =  mongoose.model("Item", itemsSchema);



app.get("/",function(req,res){
    
    Item.find({},function(err,foundItems){
        if(!err){
            List.find({},(function(err,allLists){
                res.render("list",{listTitle: "Today", allItems:foundItems, allLists: allLists})
            }))
        }
    })

    
})

app.get("/:customList",function(req,res){
    const customListName = _.capitalize(req.params.customList);

    List.findOne({name: customListName}, function(err, foundList){
            if(!foundList){
                //Create a new List
                const list = new List({
                name: customListName
                })
                list.save();
                res.redirect("/"+customListName)
            } else {
                //Show an existing List
                List.find({},(function(err,allLists){
                    res.render("list",{listTitle: foundList.name ,allItems:foundList.items, allLists: allLists})
                }))
                
            }

    })
    
})

app.post("/delete",function(req,res){
    
    const deletedItem = req.body.deleter;
    const listName = req.body.listName;

    // Item.findByIdAndRemove(deletedItem,function(err){
    //     if(err){console.log(err)}
    //     res.redirect("/")
    // })
    if(listName === "Today"){
        Item.findByIdAndRemove(deletedItem,function(err){
            res.redirect("/");})
    } else{
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id:deletedItem}}},function(err, foundList){
            if(!err){
                res.redirect("/"+listName)
            }
        })
        }


})

app.post("/",function(req,res){
    
    const itemName = req.body.newItem
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    } else{
        List.findOne({name: listName}, function(err,foundList){
            foundList.items.push(item)
            foundList.save();
            res.redirect("/"+listName)
        })
    }

    
})

app.post("/newList",function(req,res){
    const buttonListName = _.capitalize(req.body.newList);
    const listName = req.body.list

    const buttonList = new List({
        name: buttonListName
    })
    buttonList.save();
    res.redirect("/"+listName)

    // if(listName === "Today"){
    //     item.save();
    //     res.redirect("/");
    // } else{
    //     res.redirect("/"+listName)
    
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Server Started on Port 3000");
}); 