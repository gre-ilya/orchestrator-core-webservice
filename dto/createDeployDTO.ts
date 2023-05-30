export class CreateDeployDTO {
  repositoryURL: string;
  port: number;
  internalPort: number;
  nodeAmount: number;
  mainDirectoryPath: string;

  constructor (repositoryUrl: string, port: number, internalPort: number, nodeAmount: number, mainDirectoryPath: string) {
    this.repositoryURL = repositoryUrl;
    this.port = port;
    this.internalPort = internalPort;
    this.nodeAmount = nodeAmount;
    this.mainDirectoryPath = mainDirectoryPath;
  }
}
