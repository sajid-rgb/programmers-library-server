const express = require('express');
const port = 5000;
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
app.use(cors())
app.use(bodyParser.json())
app.get('/',(req,res)=>{
    res.send('Welcome')
})
console.log(process.env.DB_USER);
const MongoClient = require('mongodb').MongoClient;
const  ObjectID= require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.weqbi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("booksstore").collection("book");
  const bookCheckOutCollection = client.db("booksstore").collection("bookCheckOut");
  app.post('/addBooks',(req,res)=>{
      console.log(req.body);
      booksCollection.insertOne(req.body)

  })
  app.get('/books',(req,res)=>{
      booksCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents)
      })
  })
  app.get('/books/:id',(req,res)=>{
    booksCollection.find({_id:ObjectID(req.params.id)})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})
app.delete('/deleteBooks/:id',(req,res)=>{
    booksCollection.deleteOne({_id:ObjectID(req.params.id)})
})
app.post('/checkout',(req,res)=>{
    console.log(req.body);
     bookCheckOutCollection.insertOne(req.body)
})
app.get('/collect',(req,res)=>{
    bookCheckOutCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})
   console.log('connected');
});

app.listen(process.env.PORT || port)