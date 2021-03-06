import SFTPClient from "ssh2-sftp-client";

import { ConfigAuthFTP, FTPInterface } from "types";

import { Logger } from "common";

class FTP implements FTPInterface {
  private client: SFTPClient;
  private config: ConfigAuthFTP;
  constructor(config: ConfigAuthFTP) {
    this.config = config;
    this.client = new SFTPClient();
  }
  async connect() {
    try {
      await this.client
        .connect(this.config)
        .then(() => {
          return true;
        })
        .catch((e: any) => {
          throw new Error();
        });
      return true;
    } catch (e) {
      Logger.error("CONFIGURAÇÕES FTP INVÁLIDAS.");
      process.exit(1);
    }
  }
  async disconnect() {
    await this.client.end();
  }
  async sendFile(
    localFileName: string,
    remoteFileName: string
  ): Promise<boolean> {
    let complete = false;
    try {
      await this.client
        .fastPut(localFileName, remoteFileName)
        .then(() => {
          return this.disconnect();
        })
        .catch((err: any) => {
          console.log(err);
          Logger.error(`ERRO AO ENVIAR ${remoteFileName} FTP.`);
          process.exit(1);
        });
      complete = true;
    } catch (e) {
      throw new Error();
    }
    return complete;
  }

  async getFile(
    remoteFileName: string,
    localFileName: string
  ): Promise<boolean> {
    let complete = false;
    try {
      await this.client
        .fastGet(remoteFileName, localFileName)
        .then(() => {
          return this.disconnect();
        })
        .catch((err: any) => {
          console.error(err.message);
        });
      complete = true;
    } catch (e) {
      throw new Error();
    }
    return complete;
  }
}
export default FTP;
