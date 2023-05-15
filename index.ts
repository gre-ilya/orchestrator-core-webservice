import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as swaggerUi from 'swagger-ui-express';
// import { execa } from 'execa'
import swaggerDocument from './swagger.json';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/deployment', (req: Request, res: Response) => {
  res.send('/deployment');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
