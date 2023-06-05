import axios from 'axios';
import { response } from 'express';

export class WebappBackendService {

  static accessToken: string;
  static refreshToken: string;
  static auth() {
    let backendHost = 'http://localhost:3000';
    if (process.env.BACKEND_HOST) {
      backendHost = process.env.BACKEND_HOST;
    }
    axios
      .post(backendHost + '/api/auth/login', { email: 'orchestrator@mail.ru', password: 'superpass' })
      .then((response) => {
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static updateDeployment(buildLogs: string, deployLogs: string, status: string, deploymentId: string) {
    let backendHost = 'http://localhost:3000';
    if (process.env.BACKEND_HOST) {
      backendHost = process.env.BACKEND_HOST;
    }
    axios.patch(
      backendHost + `/api/deployments/${deploymentId}`,
      {
        buildLogs: buildLogs,
        deployLogs: deployLogs,
        status: status,
      },
      {
        headers: {
          accept: '*/*',
          Authorization: 'Bearer ' + this.accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
