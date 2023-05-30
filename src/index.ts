import express from 'express';
import { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { NodeSSH } from 'node-ssh';
import bodyParser from 'body-parser';
import { CreateDeployDTO } from '../dto/createDeployDTO';
import { StopDeployDTO } from '../dto/stopDeployDTO';
import { ScaleDeployDTO } from '../dto/scaleDeployDTO';

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

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

/*
Expected request body:
{
  repositoryURL: string,
  port: number,
  internalPort: number,
  nodeAmount: number,
  mainDirectoryPath: string
}
*/
app.post('api/deploy', async (req: Request, res: Response) => {
  const dto = new CreateDeployDTO(
    req.body.repositoryURL,
    req.body.port,
    req.body.internalPort,
    req.body.nodeAmount,
    req.body.mainDirectoryPath,
  );
  if (!response200(res)) {
    return;
  }

  const command = `/vkr/deploy.sh ${dto.repositoryURL} ${dto.port} ${dto.internalPort}
   ${dto.nodesAmount} ${dto.mainDirectoryPath}`;
  if (DEBUG) {
    console.log(command);
  } else {
    ssh
      .execCommand(command)
      .then((resolve) => {
        console.log(resolve.stdout);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.patch('api/deploy', async (req: Request, res: Response) => {
  const dto = new ScaleDeployDTO(req.body.port, req.body.nodesAmount);
  if (!response200(res)) {
    return;
  }
  const command = `/vkr/scale.sh ${dto.port} ${dto.nodesAmount}`;
});

app.delete('api/deploy', async (req: Request, res: Response) => {
  const dto = new StopDeployDTO(req.body.port);
  if (!response200(res)) {
    return;
  }
  const command = `/vkr/delete.sh ${dto.port}`;
  if (DEBUG) {
    console.log(command);
  } else {
    ssh
      .execCommand(command)
      .then((resolve) => {
        console.log(resolve.stdout);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.listen(serverPort, '0.0.0.0', () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${serverPort}`,
  );
});

ssh
  .connect({
    host: process.env.HOST,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  })
  .catch((err) => {
    console.log(err);
  });
