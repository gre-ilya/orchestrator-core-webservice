"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDeployDTO = void 0;
class CreateDeployDTO {
    constructor(repositoryUrl, port, internalPort, nodesAmount, mainDirectoryPath) {
        this.repositoryURL = repositoryUrl;
        this.port = port;
        this.internalPort = internalPort;
        this.nodesAmount = nodesAmount;
        this.mainDirectoryPath = mainDirectoryPath;
    }
}
exports.CreateDeployDTO = CreateDeployDTO;
