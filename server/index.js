const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Datastore = require('nedb');
const Jimp = require('jimp');
const db = new Datastore({ filename: __dirname + '/db/svitlo.db', autoload: true });
db.ensureIndex({ fieldName: 'timestamp', unique: true });
const cors = require('cors')

const app = express();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

function getStatus(status) {
  return status ? 'світло є!' : 'світла нема :(';
}

function formatDate(timestamp, long = false) {
  const options = long ? {weekday: 'long', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'} : {timeStyle: 'short'};
  return new Date(timestamp).toLocaleTimeString('uk-UA', options);
}

async function drawImage(data) {
  const font = await Jimp.loadFont(__dirname + '/arialreg.fnt');
  const image = await Jimp.read(`${__dirname}/light_${data.light ? 'on' : 'off'}.jpeg`);
  const textFull = `З ${formatDate(data.timestamp)} ${getStatus(data.light)}`;

  image.print(
    font, 
    0,
    -100,
    {
      text: textFull,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
    },
    1140,
    1140
  );
  return image;
}

app.use(express.json());
// app.use(cors());

app.post('/light', authenticateToken, (req, res) => {
  // console.log(req.body)
  const { light } = req.body;
  if (light == null) {
    res.send("not-ok");
    return;
  }

  db.insert({
    "timestamp": Date.now(),
    "light": light
  });

  res.send("zaeb-ok");
});

app.get('/light', (req, res) => {
  db.findOne({}).sort({ timestamp: -1 }).exec((err, data) => {
    // console.log('Data', data);
    res.send(data);
  });
});

app.get('/light/all', (req, res) => {
  db.find({}).sort({ timestamp: -1 }).exec((err, data) => {
    // console.log('Data', data);
    res.send(data);
  });
});

app.get('/light/img', async (req, res) => {

  db.find({}).sort({ timestamp: -1 }).limit(1).exec(async (err, data) => {
    const image = await drawImage(data[0]);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    res.setHeader('Content-type', 'image/jpeg');
    res.set('Content-disposition', 'inline; filename=svitlo.jpeg');
    res.send(buffer);
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
})