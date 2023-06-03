import { OrchestratorRepository } from './orchestrator.repository';
import { SSHExecCommandResponse } from 'node-ssh';

export class OrchestratorService {
  static connect() {
    return OrchestratorRepository.connect();
  }
  static isConnected() {
    return OrchestratorRepository.isConnected();
  }
  static sendTask(taskEntity: string) {
    return OrchestratorRepository.sendTask(taskEntity);
  }
  static deploy(
    repository: string,
    port: number,
    internalPort: number,
    nodesAmount: number,
    mainDirectoryPath: string,
  ): Promise<SSHExecCommandResponse | undefined> {
    return OrchestratorRepository.deploy(repository, port, internalPort, nodesAmount, mainDirectoryPath);
  }
  static scale(port: number, nodesAmount: number) {
    return OrchestratorRepository.scale(port, nodesAmount);
  }

  static delete(port: number) {
    return OrchestratorRepository.delete(port);
  }
}
