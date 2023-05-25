import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import shell from 'shelljs';
import bodyParser from 'body-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json())

async function execScript (scriptPath: string) {
  shell.exec(scriptPath, (code, stdout, stderr) => {
    console.log(`Code: ${code}`);
    console.log(`Stdout: ${stdout}`);
    console.log(`Stderr ${stderr}`);
  });
}

app.get('/deploy', async (req: Request, res: Response) => {
  execScript('./deploy.sh');
  res.send('deploy');
});

app.get('/stop', async (req: Request, res: Response) => {
  execScript('./stop.sh');
  res.send('stop');
});

app.post('/data', async (req: Request, res: Response) => {
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
