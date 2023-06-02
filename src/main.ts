import express from 'express';
import { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import bodyParser from 'body-parser';
import { CreateDeployDTO } from './deployment/dto/createDeployDTO';
import { StopDeployDTO } from './deployment/dto/stopDeployDTO';
import { ScaleDeployDTO } from './deployment/dto/scaleDeployDTO';
import { DeploymentController } from './deployment/deployment.controller';
import { OrchestratorRepository } from './orchestrator/orchestrator.repository';
import * as process from 'process';

dotenv.config();
OrchestratorRepository.connect();
const app: Express = express();
const serverPort = Number(process.env.PORT);

app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json());

app.use('/api', DeploymentController);

app.listen(serverPort, '0.0.0.0', () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${serverPort}`,
  );
});
