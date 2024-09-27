"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmqService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const key_service_1 = require("./key-service");
const CmdPatterns = {
    test: "test",
};
let RmqService = class RmqService {
    constructor(clientWS, clientChatAI) {
        this.clientWS = clientWS;
        this.clientChatAI = clientChatAI;
        this.queue = {
            clientWS: this.clientWS,
            clientChatAI: this.clientChatAI,
        };
        this.instanceId = Math.random();
    }
    getInstanceId() {
        return this.instanceId;
    }
    async sendMsg(clientType, pattern, data) {
        try {
            console.log("instanceID:", this.getInstanceId());
            console.log("clientType:", clientType);
            const client = this.queue[clientType];
            if (!client) {
                throw new Error("Client không hợp lệ");
            }
            return await (0, rxjs_1.lastValueFrom)(client.send(pattern, data));
        }
        catch (error) {
            console.error("Error sending message:", error);
        }
    }
};
exports.RmqService = RmqService;
exports.RmqService = RmqService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(key_service_1.RABBITMQ_KEY.ws.key)),
    __param(1, (0, common_1.Inject)(key_service_1.RABBITMQ_KEY.chatai.key)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        microservices_1.ClientProxy])
], RmqService);
//# sourceMappingURL=rmq.service.js.map