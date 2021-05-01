const express =  require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;
MongoClient.connect('mongodb://localhost:27017/Inventory',(err, database) => {
    if (err) return console.log(err)
    console.log('Connected')
    db=database.db('Inventory')
      app.listen(3000, () => 
    {
    console.log('listening on 3000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))  
app.use(bodyParser.json())
app.use(express.static('public'))
    
    //Homepage
app.get( '/', (req,res) =>{
    db.collection('Mobiles').find().toArray((err,result)=>{
        if(err) return console.log(err)
    res.render('homepage.ejs',{data: result})
})
})

app.get('/create', (req,res)=>{
    res.render('add.ejs')
})

app.get('/updatestock', (req,res)=>{
    res.render('update.ejs')
})

app.get('/deleteproduct', (req,res)=>{
    res.render('delete.ejs')
})

/*app.get('/AddData', (req,res)=>{
    db.collection('Mobiles').save(req.body, (err, result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})*/

app.post ('/AddData', (req,res)=>{
    db.collection('Mobiles').save(req.body, (err, result)=>{
        if (err) return console.log(err)
    res.redirect('/')
    })
})
app.post('/update', (req, res) => {

    db.collection('Mobiles').find().toArray((err, result) => {
        if (err)
            return console.log(err)
        for(var i=0; i<result.length; i++)
        {
            if(result[i].Product_ID==req.body.Product_ID)
            {
                s = result[i].Stock
                break
            }
        }
        db.collection('Mobiles').findOneAndUpdate({Product_ID : req.body.Product_ID}, {
            $set: {Stock: parseInt(s) + parseInt(req.body.Stock)}}, {sort: {_id:-1}},
            (err, result) => {
            if (err)
                return res.send(err)
            console.log(req.body.id+' stock updated')
            res.redirect('/')
            })
        })
    })
app.post('/delete', (req,res)=>{
    db.collection('Mobiles').findOneAndDelete({Product_ID : req.body.Product_ID}, (err,result)=>{
        if (err)
            return console.log(err)
        console.log(req.body.id+' product deleted')
        res.redirect('/')
    })
})
