import { Request, Response, Router } from 'express';
import { CreateDeployDTO } from '../../dto/createDeployDTO';

const router = Router();

router.post('/api/deploys', async (req: Request, res: Response) => {
  const dto = new CreateDeployDTO(
    req.body.repositoryURL,
    req.body.port,
    req.body.internalPort,
    req.body.nodesAmount,
    req.body.mainDirectoryPath,
  );
  const command = `/vkr/deploy.sh ${dto.repositoryURL} ${dto.port} ${dto.internalPort} ${dto.nodesAmount} ${dto.mainDirectoryPath}`;
  if (process.env.DEBUG === 'TRUE') {
    console.log(command);
    res.sendStatus(200);
    return;
  }
  // if (!response200(res)) {
  //   return;
  // }
  // ssh
  //   .execCommand(command)
  //   .then((res) => {
  //     console.log(
  //       `I am inside func!\nSTDOUT: ${res.stdout}\nSTDERR: ${res.stderr}`,
  //     );
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

export const DeploymentController: Router = router;
