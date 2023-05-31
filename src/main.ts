import express from 'express';
import { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';
import bodyParser from 'body-parser';
import { CreateDeployDTO } from '../dto/createDeployDTO';
import { StopDeployDTO } from '../dto/stopDeployDTO';
import { ScaleDeployDTO } from '../dto/scaleDeployDTO';
import { DeploymentController } from './deployment/deployment.controller';
import * as process from 'process';

dotenv.config();

const DEBUG = true;
const ssh = new NodeSSH();
const app: Express = express();
const serverPort = Number(process.env.PORT);

function response200(res: Response) {
  if (ssh.isConnected()) {
    res.sendStatus(200);
    return true;
  } else {
    res.sendStatus(500);
    return false;
  }
}

app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());

// There was app.post
app.use(DeploymentController);

app.patch('/api/deploys', async (req: Request, res: Response) => {
  const dto = new ScaleDeployDTO(req.body.port, req.body.nodesAmount);
  const command = `/vkr/scale.sh ${dto.port} ${dto.nodesAmount}`;
  if (DEBUG) {
    console.log(command);
    res.sendStatus(200);
    return;
  }
  if (!response200(res)) {
    return;
  }
  // updateDeployStatusOnWebapp(await sendCommandToOrchestrator(command));
});

app.delete('/api/deploys', async (req: Request, res: Response) => {
  const dto = new StopDeployDTO(req.body.port);
  const command = `/vkr/delete.sh ${dto.port}`;
  if (DEBUG) {
    console.log(command);
    res.sendStatus(200);
    return;
  }
  if (!response200(res)) {
    return;
  }
  // updateDeployStatusOnWebapp(await sendCommandToOrchestrator(command));
});

app.listen(serverPort, '0.0.0.0', () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${serverPort}`,
  );
});

ssh
  .connect({
    host: process.env.HOST,
    privateKey: process.env.PRIVATE_KEY,
    passphrase: process.env.PASSPHRASE,
    username: process.env.USERNAME,
    // password: process.env.PASSWORD,
  })
  .catch((err) => {
    console.log(err);
  });
