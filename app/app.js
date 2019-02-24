var express = require('express');
var app = express();

var MongoClient = require('mongodb').MongoClient;

// per gestire le richieste POST:
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
    res.send({message: 'Teatro Arcimboldi - WebService RESTful'});
});

// Read
app.get('/lista', function (req, res) {

    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Arcimboldi").find().sort({data:1}).toArray(function(err, result) {
          if (err) throw err;
            res.send(result);
          db.close();
      });
    });
    
});

// Create
app.post('/prenota', function (req, res) {
    
    var data = new Date(req.body.data);
    var fila = parseInt(req.body.fila);
    var poltrona = parseInt(req.body.poltrona);

    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      dbo.collection("Arcimboldi").find().sort({numero:-1}).limit(1).toArray(function (err, result){
        var maxNum;
        if (result[0] == null)
            maxNum = 0;
        else
            maxNum = result[0].numero;
        var newInfo = { numero: maxNum + 1, data: data, fila: fila, poltrona: poltrona};
        dbo.collection("Arcimboldi").insertOne(newInfo, function(err, result) {
          if (err) throw err;
            res.send({result: 'ok', numeroPrenotazione: maxNum + 1})
          db.close();
        });
      });
    });
    
});

//Update
app.put('/modifica/:n/:data', function (req, res) {
    // inserire qui il codice per effettuare l'aggiornamento di una prenotazione
});

//Delete
app.delete('/cancella/:n', function (req, res) {
    var n = parseInt(req.params.n);
    MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
      if (err) {
        throw err;
      }
      var dbo = db.db("5E");
      var delInfo = { numero: n};
      dbo.collection("Arcimboldi").deleteOne(delInfo, function(err, result) {
          if (err) throw err;
            res.send({result: 'ok'})
          db.close();
      });
    });
    
});

app.listen(9000, function () {
    console.log('Example app listening on port 9000!');
});

