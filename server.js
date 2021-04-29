const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const MongoClient=require('mongodb').MongoClient;

var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Fashion',(err,database)=>{
    if(err) return console.log(err);
    db=database.db('Fashion')
    app.listen(4000,()=>{
        console.log('Listening at port number 4000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//Home page
app.get('/',(req,res)=> {
    db.collection('Wear').find().toArray((err,result)=>{
        if(err)return console.log(err)
        res.render('homepage.ejs',{data:result})
    })
})

app.get("/update",(req,res)=>{
    res.render('update.ejs')
})
app.get("/add",(req,res)=>{
    res.render('add.ejs')
})
app.get("/delete",(req,res)=>{
    res.render('delete.ejs')
})
//delete product 
app.post('/deleteproduct',(req,res)=>{
    db.collection('Wear').deleteOne({pid:req.body.pid},(err,result)=>{
        if(err)
        return console.log(err);
        console.log("item with product id"+req.body.pid+" is deleted")
        res.redirect('/')
})
})

//add new product to collection
app.post('/addproduct',(req,res)=>{
    db.collection('Wear').save(req.body,(err,result)=>{
        if(err)
        return console.log(err);
        res.redirect('/')
    })
})

//update the stock
app.post('/updatestock',(req,res)=>{
    db.collection('Wear').find().toArray((err,result)=>{
        if(err)
        return console.log(err)
for(var i=0;i<result.length;i++)
{
    if(result[i].pid==req.body.pid)
    {
        s=result[i].quantity;
        break;
    }
}
db.collection('Wear').findOneAndUpdate({pid:req.body.pid},{
    $set:{quantity:parseInt(s)+parseInt(req.body.quantity)}},{sort:{_id:-1}},
    (err,result)=>{
        if (err)
        return res.send(err)
        console.log(req.body.pid+' stock updated')
        res.redirect('/')
    })
})
})