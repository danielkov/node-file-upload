const express = require('express'),
      app = express(),
      mimetypes = require('./mimetypes'),
      multer = require('multer'),
      upload = multer({
        dest: 'uploads/',
        fileFilter: function (req, file, cb) {
          if (mimetypes.indexOf(file.mimetype) === -1) {
            console.log(file.mimetype);
            return cb(new Error('Filetype not supported.'));
          }
          cb(null, true)
        }
      }),
      fs = require('fs'),
      path = require('path'),
      mongoose = require('mongoose'),
      Image = require('./models/image'),
      bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/imgupload', (err) => {
  if (err) throw err;
});

mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.once('open', function() {
  console.log('Connected to MongoDB!');
});

app.use(express.static('uploads'));
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/images', (req, res) => {
  Image.find({}).sort({created:-1}).limit(10).exec((err, docs) => {
    if (err) {
      res.send({
        success: false,
        message: 'Something went wrong, while fetching data.'
      })
    }
    if (docs) {
      res.send(docs)
    }
  })
})

app.post('/upload', upload.single('fileInput'), (req, res) => {
  if (req.file) {
    let file = req.file;
    let fileName = randomName(20) + '.' + file.mimetype.split('/')[1];
    let newFile = path.join(file.destination, fileName);
    fs.rename(file.path, newFile);
    let image = new Image({
      title: req.body.title || file.originalname,
      src: fileName
    });
    image.save((err, doc) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: 'Something went wrong while saving.'
        });
      }else if (doc) {
        res.send({
          success: true,
          image: doc
        })
      }else {
        res.send({
          success: false,
          message: 'Something went wrong.'
        })
      }
    })
  }else {
    res.send({
      success: false,
      message: 'File not valid or filetype not supported.'
    })
  }
})

app.listen(3000, function(){
  console.log(`App up at ${3000}!`);
})

function randomName (l) {
  let n = '';
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (var i = 0; i < l; i++) {
    let r = Math.floor(Math.random() * (chars.length));
    let c = chars[r];
    n += c;
  }
  return n;
}
