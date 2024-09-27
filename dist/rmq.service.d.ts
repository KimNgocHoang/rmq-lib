import { ClientProxy } from "@nestjs/microservices";
declare const CmdPatterns: {
    readonly test: "test";
};
interface CommandData {
    [CmdPatterns.test]: string;
}
interface CommandDataMap {
    clientWS: CommandData;
    clientChatAI: CommandData;
}
export declare class RmqService {
    private readonly clientWS;
    private readonly clientChatAI;
    private instanceId;
    private queue;
    constructor(clientWS: ClientProxy, clientChatAI: ClientProxy);
    getInstanceId(): number;
    sendMsg<ClientType extends keyof CommandDataMap, CmdType extends keyof CommandDataMap[ClientType]>(clientType: ClientType, pattern: {
        cmd: CmdType;
    }, data: CommandDataMap[ClientType][CmdType]): Promise<any>;
}
export {};
