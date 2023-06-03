export class CreateDeployDTO {
  repository: string;
  port: number;
  internalPort: number;
  nodesAmount: number;
  mainDirectoryPath: string;

  constructor(repository: string, port: number, internalPort: number, nodesAmount: number, mainDirectoryPath: string) {
    this.repository = repository;
    this.port = port;
    this.internalPort = internalPort;
    this.nodesAmount = nodesAmount;
    this.mainDirectoryPath = mainDirectoryPath;
  }
}
