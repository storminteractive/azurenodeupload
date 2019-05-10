// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const serveIndex = require('serve-index');

 // SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
  })
   
var upload = multer({ storage: storage })

//CREATE EXPRESS APP
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

//ROUTES WILL GO HERE
app.get('/', function(req, res) {
    //res.json({ message: 'WELCOME' });   
    res.sendFile(__dirname + '/index.html');
    console.log("Hello2! Sending / to "+req.ip+"("+req.hostname+")");
});

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    console.log("Got /uploadfile from "+req.ip+"("+req.hostname+")");
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file.filename);
});

app.use('/uploads', serveIndex(__dirname + '/uploads'));
app.use('/uploads', express.static(__dirname+"/uploads"));

 
app.listen(process.env.PORT, () => console.log('Server started on port 3000'));
