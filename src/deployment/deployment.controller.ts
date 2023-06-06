import { Request, Response, Router } from 'express';
import { CreateDeployDTO } from './dto/createDeployDTO';
import { ScaleDeployDTO } from './dto/scaleDeployDTO';
import { StopDeployDTO } from './dto/stopDeployDTO';
import { OrchestratorService } from '../orchestrator/orchestrator.service';
import { WebappBackendService } from '../webapp-backend/webapp-backend.service';

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
  );
  OrchestratorService.isConnected().then((response) => {
    if (!response) {
      res.statusCode = 500;
      res.send({
        message: 'No connection with orchestrator system.',
      });
      return;
    }
    res.sendStatus(200);
    OrchestratorService.deploy(dto.repository, dto.port, dto.internalPort, dto.nodesAmount, dto.mainDirectoryPath).then(
      (result) => {
        WebappBackendService.auth();
        if (!result) {
          WebappBackendService.updateDeployment(
            'No connection with orchestrator!',
            '',
            'Failed',
            req.body.deploymentId,
          );
          return;
        }
        WebappBackendService.updateDeployment(
          `${result.stdout}\n${result.stderr}\n`,
          '',
          'Success',
          req.body.deploymentId,
        );
      },
    );
  });
});

router.patch('/deploys', async (req: Request, res: Response) => {
  const dto = new ScaleDeployDTO(req.body.port, req.body.nodesAmount);
  OrchestratorService.isConnected().then((result) => {
    WebappBackendService.auth();
    if (!result) {
      WebappBackendService.updateDeployment(`No connection with orchestrator!`, '', 'Failed', req.body.deploymentId);
      return;
    }
    res.sendStatus(200);
    OrchestratorService.scale(dto.port, dto.nodesAmount).then((result) => {
      if (!result) {
        WebappBackendService.updateDeployment(`No connection with orchestrator!`, '', 'Failed', req.body.deploymentId);
        return;
      }
      console.log(`
    ${result.stdout}
    `);
    });
    WebappBackendService.updateDeployment(`${result.stdout}\n${result.stderr}\n`, '', 'Success', req.body.deploymentId);
  });
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
