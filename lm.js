
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
var multer = require('multer');

const app = express();
var fileupload = require("express-fileupload");
app.use(fileupload());
//Declarando y adquiriendo nodesspi e informacion de usuario
app.use(function (req, res, next) {
  var nodeSSPI = require('node-sspi')
  var nodeSSPIObj = new nodeSSPI({
    retrieveGroups: true
  })
  nodeSSPIObj.authenticate(req, res, function(err){
    res.finished || next()
  })
})
//Carpeta view y visor ejs
app.set('views',__dirname + '/views');
app.set('view_engine', 'ejs');

//Carpeta publica
app.use(express.static('public')); 

app.use(express.static('D:\\DEL\\liberacion_mandriles')); 
//app.use(express.static('C:\\test')); 
//Requiriendo rutas
const routes = require('./routes/routes');
app.use(express.static('node_modules'))
//Declarando body parser y sus funciones
app.use(bodyParser.urlencoded({extended:true}));

//Declarando rutas de express
app.use(routes);


//Declarando puertos a utilizarse
app.set('port', process.env.PORT || 3006)
//Encendiendo el servidor 
var server = http.createServer(app)
    server.listen(app.get('port'), function () {
      console.log('Servidor encendido en el puerto ' + app.get('port'))
    })

