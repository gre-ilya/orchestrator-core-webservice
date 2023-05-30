export class ScaleDeployDTO {
  port: number;
  nodesAmount: number;

  constructor (port: number, nodesAmount: number) {
    this.port = port;
    this.nodesAmount = nodesAmount;
  }
}
