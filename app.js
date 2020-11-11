const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname+"/date.js")
const app = express();
const mongoose = require("mongoose")
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistdb", {useNewUrlParser: true });

const itemsSchema = {
    name: String
}

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

const Item =  mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Go to Work"
})

const item2 = new Item({
    name: "Come back Home"
})

const item3 = new Item({
    name: "Eat"
})

const defaultArray = [item1,item2,item3]



app.get("/",function(req,res){
    
    Item.find({},function(err,foundItems){
        if(foundItems.length ===0){
            Item.insertMany(defaultArray,function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Everything went well in the DB side! :)")
                }
            })
            res.redirect("/")
        }else{
            res.render('list', {listTitle: "Today", allItems:foundItems});
        }
    })

    
})

app.get("/:customList",function(req,res){
    const customListName = req.params.customList

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //Create a new List
                const list = new List({
                    name: customListName,
                    items: defaultArray
                })
            
                list.save();
                res.redirect("/"+customListName)
            } else {
                //Show an existing List
                res.render("list",{listTitle: foundList.name ,allItems:foundList.items})
            }

        }
    })
    
})

app.post("/delete",function(req,res){
    
    const deletedItem = req.body.deleter;
    Item.findByIdAndRemove(deletedItem,function(err){
        if(err){console.log(err)}
        res.redirect("/")
    })
})

app.post("/",function(req,res){
    
    const itemName = req.body.newItem

    const item = new Item({
        name: itemName
    })

    item.save();
    
    res.redirect("/")
})


app.listen(3000, function(){
    console.log("Server Started on Port 3000");
});