const express = require('express');
const bodyParser = require('body-parser');
const password = 'uWS$itGXKfNS@G9';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://organicUser:uWS$itGXKfNS@G9@cluster0.zypoh.mongodb.net/organicdb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})

//MONGODB CODE

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");
    // perform actions on the collection object
    // console.log('database connected');
    //Insert Data
    const product = {name : "Modhu", price: 25, quantity: 20};

    app.get('/products', (req,res) => { 
        productCollection.find({})
        .toArray( (error, document) => {
            res.send(document);
        })
    })
    
    app.get("/product/:id", (req,res) => {
        productCollection.find({_id : ObjectId(req.params.id)})
        .toArray((err,document) => {
            res.send(document[0]);
        })
    })

    app.post("/addProduct",(req,res)=>{
        const product = req.body;
        console.log(product);
        productCollection.insertOne(product)
        .then(result => {
            console.log('product added');
            // res.send('data send success');
            res.redirect('/');
        })
    })

    app.patch('/update/:id',(req,res) => {
        console.log('hit api inside');
        console.log(req.body.params);
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set : {price: req.body.price, quantity: req.body.quantity}
        })
        .then(result => {
            console.log(result);
            res.send(result.modifiedCount > 0);
        })
    })

    app.delete('/delete/:id', (req,res) => {
        // console.log(req.params.id);
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            console.log(result);
            res.send(result.deletedCount > 0);
        })
    })
});


app.listen(3000,console.log('port started 3000'));
