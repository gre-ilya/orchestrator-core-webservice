import { Request, Response, Router } from 'express';
import { CreateDeployDTO } from './dto/createDeployDTO';
import { ScaleDeployDTO } from './dto/scaleDeployDTO';
import { StopDeployDTO } from './dto/stopDeployDTO';
import { OrchestratorService } from '../orchestrator/orchestrator.service';

const router = Router();

/*
Request Body: {
  repository: string,
  port: number,
  internalPort: number,
  nodesAmount: number,
  mainDirectoryPath: string,
  deploymentId: string
}
 */

router.post('/deploys', async (req: Request, res: Response) => {
  const dto = new CreateDeployDTO(
    req.body.repository,
    req.body.port,
    req.body.internalPort,
    req.body.nodesAmount,
    req.body.mainDirectoryPath,
    // req.body.deploymentId,
  );
  console.log(dto);
  if (!OrchestratorService.isConnected()) {
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
  return OrchestratorService.deploy(
    dto.repository,
    dto.port,
    dto.internalPort,
    dto.nodesAmount,
    dto.mainDirectoryPath,
  ).then((result) => {
    if (!result) {
      console.log('Deploy Error!');
      return;
    }
    console.log(`
    ${result.stdout}
    `);
  });
});

router.patch('/deploys', async (req: Request, res: Response) => {
  const dto = new ScaleDeployDTO(req.body.port, req.body.nodesAmount);
  if (!OrchestratorService.isConnected()) {
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
  OrchestratorService.scale(dto.port, dto.nodesAmount).then((result) => {
    if (!result) {
      console.log('Deploy Error!');
      return;
    }
    console.log(`
    ${result.stdout}
    `);
  });
  // updateDeployStatusOnWebapp(await sendCommandToOrchestrator(command));
});

router.delete('/deploys', async (req: Request, res: Response) => {
  const dto = new StopDeployDTO(req.body.port);
  if (!OrchestratorService.isConnected()) {
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
  OrchestratorService.delete(dto.port).then((result) => {
    if (!result) {
      console.log('Deploy Error!');
      return;
    }
    console.log(`
    ${result.stdout}
    `);
  });
  // updateDeployStatusOnWebapp(await sendCommandToOrchestrator(command));
});

export const DeploymentController: Router = router;
