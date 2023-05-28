import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { NodeSSH } from 'node-ssh';
import bodyParser from 'body-parser';

dotenv.config();

const ssh = new NodeSSH()
const app: Express = express();
const port = process.env.PORT;

ssh.connect({
  host: process.env.HOST,
  username: process.env.USERNAME,
  privateKey: process.env.PRIVATE_KEY,
  passphrase: process.env.PASSPHRASE
}).catch((err) => {
  console.log(err);
})

app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json())

app.get('/deploy', async (req: Request, res: Response) => {
  ssh.execCommand('./script.sh')
    .then((resolve) => {
      res.send(resolve.stdout)
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
