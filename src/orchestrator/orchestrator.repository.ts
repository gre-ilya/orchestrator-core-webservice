import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';
import process from 'process';
import { OrchestratorService } from './orchestrator.service';

export class OrchestratorRepository {
  static orchestratorSSHConnection = new NodeSSH();
  static connect() {
    this.orchestratorSSHConnection
      .connect({
        host: process.env.HOST,
        privateKey: process.env.PRIVATE_KEY,
        passphrase: process.env.PASSPHRASE,
        username: process.env.USERNAME,
        // password: process.env.PASSWORD,
      })
      .then((): boolean => {
        return true;
      })
      .catch((err): boolean => {
        console.log(err);
        return false;
      });
  }
  static isConnected(): Promise<SSHExecCommandResponse | undefined> {
    return this.orchestratorSSHConnection.execCommand('ls').catch((err) => {
      return undefined;
    });
  }
  static sendTask(taskEntity: string): Promise<SSHExecCommandResponse | undefined> {
    return this.orchestratorSSHConnection.execCommand(taskEntity).catch((err) => {
      console.log(err);
      return undefined;
    });
  }
  static deploy(
    repository: string,
    port: number,
    internalPort: number,
    nodesAmount: number,
    mainDirectoryPath: string,
  ): Promise<SSHExecCommandResponse | undefined> {
    const command = `/vkr/deploy.sh ${repository} ${port} ${internalPort} ${nodesAmount} ${mainDirectoryPath}`;
    if (process.env.DEBUG === 'TRUE') {
      console.log(command);
    }
    return OrchestratorRepository.sendTask(command);
  }
  static scale(port: number, nodesAmount: number) {
    const command = `/vkr/scale.sh ${port} ${nodesAmount}`;
    if (process.env.DEBUG === 'TRUE') {
      console.log(command);
    }
    return OrchestratorRepository.sendTask(command);
  }
  static delete(port: number) {
    const command = `/vkr/delete.sh ${port}`;
    if (process.env.DEBUG === 'TRUE') {
      console.log(command);
    }
    return OrchestratorRepository.sendTask(command);
  }
}
