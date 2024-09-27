import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { RABBITMQ_KEY } from "./key-service";

const CmdPatterns = {
  test: "test",
} as const;

interface CommandData {
  [CmdPatterns.test]: string;
}

interface CommandDataMap {
  clientWS: CommandData;
  clientChatAI: CommandData;
}

@Injectable()
export class RmqService {
  private instanceId: number;
  private queue: Record<string, ClientProxy>;
  constructor(
    @Inject(RABBITMQ_KEY.ws.key) private readonly clientWS: ClientProxy,
    @Inject(RABBITMQ_KEY.chatai.key) private readonly clientChatAI: ClientProxy
  ) // @Inject('RABBITMQ_WS_CONNECTION') private readonly clientWS: ClientProxy,
  // @Inject(DF_NAME) private readonly clientChatAI: ClientProxy,
  {
    this.queue = {
      clientWS: this.clientWS,
      clientChatAI: this.clientChatAI,
    };
    this.instanceId = Math.random();
  }

  getInstanceId() {
    return this.instanceId;
  }

  // Hàm send với lựa chọn client và cmd tương ứng
  public async sendMsg<ClientType extends keyof CommandDataMap, CmdType extends keyof CommandDataMap[ClientType]>(
    clientType: ClientType, // chọn loại client
    pattern: { cmd: CmdType },
    data: CommandDataMap[ClientType][CmdType]
  ): Promise<any> {
    try {
      console.log("instanceID:", this.getInstanceId());
      console.log("clientType:", clientType);

      const client = this.queue[clientType];
      if (!client) {
        throw new Error("Client không hợp lệ");
      }
      return await lastValueFrom(client.send(pattern, data));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}
