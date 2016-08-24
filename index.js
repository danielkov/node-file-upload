const express = require('express'),
      app = express(),
      multer = require('multer'),
      upload = multer({ dest: 'uploads/' }),
      fs = require('fs'),
      path = require('path');

app.use(express.static('uploads'));

app.get('/', (req, res) => {
  res.send(`<h1>File upload</h1>
<form action="upload" method="post" enctype="multipart/form-data">
  <input type="file" name="fileInput">
  <input type="submit" value="Send">
</form>
    `)
})

app.post('/upload', upload.single('fileInput'), (req, res) => {
  let file = req.file;
  let newFile = path.join(file.destination, file.originalname);
  fs.rename(file.path, newFile);
  let options = {
    root: __dirname + '/uploads/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
    }
  };
  res.sendFile(file.originalname, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', file.originalname);
    }
  });
})

app.listen(3000, function(){
  console.log(`App up at ${3000}!`);
})
