const express = require('express'),
      app = express(),
      multer = require('multer'),
      upload = multer({ dest: 'uploads/' }),
      fs = require('fs'),
      path = require('path');

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
  fs.rename(file.path, path.join(file.destination, file.originalname));
  res.send(file);
})

app.listen(3000, function(){
  console.log(`App up at ${3000}!`);
})
