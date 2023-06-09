import { Request, Response, Router } from 'express';
import { CreateDeployDTO } from './dto/createDeployDTO';
import { ScaleDeployDTO } from './dto/scaleDeployDTO';
import { StopDeployDTO } from './dto/stopDeployDTO';
import { OrchestratorService } from '../orchestrator/orchestrator.service';
import { WebappBackendService } from '../webapp-backend/webapp-backend.service';

const router = Router();
const noConnectionBuildLog = 'No connection with orchestrator system.';

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
    WebappBackendService.auth();
    if (!response) {
      res.statusCode = 500;
      res.send({
        message: noConnectionBuildLog,
      });
      WebappBackendService.updateDeployment(noConnectionBuildLog, '', 'Failed', req.body.deploymentId);
      return;
    }
    res.sendStatus(200);
    OrchestratorService.deploy(dto.repository, dto.port, dto.internalPort, dto.nodesAmount, dto.mainDirectoryPath).then(
      (response) => {
        if (!response) {
          WebappBackendService.updateDeployment(noConnectionBuildLog, '', 'Failed', req.body.deploymentId);
          return;
        }
        // if (response.stderr) {
        //   console.log('response.stderr true ' + response.stderr);
        // }
        // if (response.stdout) {
        //   console.log('response stdout true ' + response.stdout);
        // }
        let status = 'Success';
        if (response.code != 0) {
          status = 'Failed';
        }
        WebappBackendService.updateDeployment(response.stderr, response.stdout, status, req.body.deploymentId);
      },
    );
  });
});

router.patch('/deploys', async (req: Request, res: Response) => {
  const dto = new ScaleDeployDTO(req.body.port, req.body.nodesAmount);
  OrchestratorService.isConnected().then((response) => {
    WebappBackendService.auth();
    if (!response) {
      res.statusCode = 500;
      res.send({
        message: noConnectionBuildLog,
      });
      WebappBackendService.updateDeployment(noConnectionBuildLog, '', 'Failed', req.body.deploymentId);
      return;
    }
    res.sendStatus(200);
    OrchestratorService.scale(dto.port, dto.nodesAmount).then((response) => {
      if (!response) {
        WebappBackendService.updateDeployment(noConnectionBuildLog, '', 'Failed', req.body.deploymentId);
        return;
      }
      const buildLogs = `${response.stderr}\n${response.stdout}\n`;
      let status = 'Success';
      if (response.code != 0) {
        status = 'Failed';
      }
      WebappBackendService.updateDeployment(response.stderr, response.stdout, status, req.body.deploymentId);
    });
  });
});

router.delete('/deploys', async (req: Request, res: Response) => {
  const dto = new StopDeployDTO(req.body.port);
  OrchestratorService.isConnected().then((response) => {
    WebappBackendService.auth();
    if (!response) {
      res.statusCode = 500;
      res.send({
        message: noConnectionBuildLog,
      });
      WebappBackendService.updateDeployment(noConnectionBuildLog, '', 'Failed', req.body.deploymentId);
      return;
    }
    res.sendStatus(200);
    OrchestratorService.delete(dto.port).then((response) => {
      if (!response) {
        WebappBackendService.updateDeployment(noConnectionBuildLog, '', 'Failed', req.body.deploymentId);
        return;
      }
      let status = 'Removed';
      if (response.code != 0) {
        status = 'Success';
      }
      WebappBackendService.updateDeployment(response.stderr, response.stdout, status, req.body.deploymentId);
    });
  });
});

export const DeploymentController: Router = router;
