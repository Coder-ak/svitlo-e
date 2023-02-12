import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import Nedb from 'nedb';
import Jimp from 'jimp';
import Randomstring from 'randomstring';
import jwt, { Secret } from 'jsonwebtoken';
import { SvitloData } from '../interfaces/svitlo-data';

dotenv.config({ path: '.env' });

const app: Express = express();
const db = new Nedb<SvitloData>({ filename: process.env.DB_PATH, autoload: true });



if (process.argv.includes('develop')) {
  app.use(cors());
}
app.use(express.json());

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET as Secret, (err, data) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.body.area = (data as { area: string }).area;

    next();
  });
};

const getStatus = (status: boolean) => {
  return status ? 'світло є!' : 'світла нема :(';
};

const formatDate = (timestamp: number, long = false) => {
  const options = long ? { weekday: 'long', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' } : { timeStyle: 'short' };
  return new Date(timestamp).toLocaleTimeString('uk-UA', <any>options);
};

const drawImage = async (data: SvitloData) => {
  const font = await Jimp.loadFont(__dirname + '/assets/arial-bold.fnt');
  const image = await Jimp.read(`${__dirname}/assets/light_${data.light ? 'on' : 'off'}.jpeg`);
  const textFull = `З ${formatDate(data.timestamp)} ${getStatus(data.light)}`;

  image.print(
    font,
    0,
    -50,
    {
      text: textFull,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
    },
    600,
    600
  );
  return image;
};

enum areas {
  rad0 = 'rad0',
  rad1 = 'rad1',
  rad2 = 'rad2',
}

const getArea = (areaId: string): string => {
  return areas[areaId as areas];
};

app.post('/light', authenticateToken, (req, res, next) => {
  const { light, area } = req.body;

  console.log('payoad', new Date(), light, area);

  if (light == null || area == null) {
    res.send('not-ok');
    return;
  }

  db.insert({
    timestamp: Date.now(),
    light: !!light,
    area: getArea(area),
  });

  res.send('zaeb-ok');
});

app.get('/light/:id?', (req, res) => {
  (db as any)
    .findOne(req.params.id ? { area: getArea(req.params.id) } : {}, { light: 1, timestamp: 1, _id: 0 })
    .sort({ timestamp: -1 })
    .exec((err: Error, data: SvitloData) => {
      res.send(data);
    });
});

app.get('/light/all/:id?', (req, res) => {
  db.find(req.params.id ? { area: getArea(req.params.id) } : {}, { light: 1, timestamp: 1, _id: 0 })
    .sort({ timestamp: -1 })
    .exec((err: Error | null, data: SvitloData[]) => {
      res.send(data);
    });
});

app.get('/light/img/:id?', async (req, res) => {
  (db as any)
    .findOne(req.params.id ? { area: getArea(req.params.id) } : {}, { light: 1, timestamp: 1, _id: 0 })
    .sort({ timestamp: -1 })
    .exec(async (err: Error, data: SvitloData) => {
      const image = await drawImage(data);
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
      res.setHeader('Content-type', 'image/jpeg');
      res.set('Content-disposition', 'inline; filename=' + Randomstring.generate(10) + '.jpeg');
      res.send(buffer);
    });
});

app.listen(process.env.PORT, () => {
  console.log('Server is up on port ' + process.env.PORT);
});
