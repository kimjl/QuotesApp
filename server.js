const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var db
// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password!
MongoClient.connect('mongodb://YOURUSERNAME:YOURPASSWORD@ds231228.mlab.com:31228/quotesdb', (err, client) => {
  if (err) return console.log(err)
  db = client.db('quotesdb')
  app.listen(3000, () => {
    console.log('listening on 3000')
  });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
  var cursor = db.collection('quotes').find().toArray((err, result) => {
    console.log(result)
    res.render('index.ejs', {quotes: result})
  })
});

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  });
});

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Test'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
