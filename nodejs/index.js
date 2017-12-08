require('dotenv').config();

const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const proxy = require('express-http-proxy');
const serveIndex = require('serve-index')

const serverName = process.env.SERVER_NAME || 'default';
const port = process.env.PORT || 8000;
const baseImageUrl = process.env.BASE_IMAGE_URL;

const proxyBaseImageUrl = baseImageUrl
  ? proxy(baseImageUrl, {
      proxyReqPathResolver: function (req) {
        const newPath = baseImageUrl + req.path;
        console.log(newPath);
        return newPath;
      }
    })
  : express.static(path.join(__dirname, 'public/images'));
const app = express();

app.use('/images', proxyBaseImageUrl);
app.use(fileUpload());

const uploadDirname = path.join(__dirname, 'uploads')
app.use('/uploads', express.static(uploadDirname), serveIndex(uploadDirname, { 'icons': true }));

app.get('/', (req, res) => {
  res.send(`
    <h1>${serverName}</h1>
    <p><img src='images/herman.jpg' width="200" /></p>
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="file" name="foo" /><br /><br />
      <input type="submit" value="Upload" />
    </form>
  `);
});

app.post('/upload', (req, res) => {
  if (!req.files) return res.status(400).send('No files were uploaded!');

  const { foo } = req.files;
  const uploadTo = `uploads/${foo.name}`;

  foo.mv(uploadTo, (err) => {
    if (err) return res.status(500).send(err);
    res.send(`
      <h1>${serverName}</h1>
      <p>File uploaded to <a href="${uploadTo}">${uploadTo}</a></p>
      <p><img src='${uploadTo}' width="200" /></p>
    `);
  });
});

app.listen(port, () => {
  console.log(`Server ${serverName} listening on port ${port}!`);
});
