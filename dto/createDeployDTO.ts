export class CreateDeployDTO {
  repositoryURL: string;
  port: number;
  internalPort: number;
  nodesAmount: number;
  mainDirectoryPath: string;

  constructor (repositoryUrl: string, port: number, internalPort: number, nodesAmount: number, mainDirectoryPath: string) {
    this.repositoryURL = repositoryUrl;
    this.port = port;
    this.internalPort = internalPort;
    this.nodesAmount = nodesAmount;
    this.mainDirectoryPath = mainDirectoryPath;
  }
}
