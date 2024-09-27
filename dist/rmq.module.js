"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RmqModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmqModule = void 0;
const common_1 = require("@nestjs/common");
const rmq_service_1 = require("./rmq.service");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const key_service_1 = require("./key-service");
const DEFAULT_RMQ_HOST_NAME = "amqp://localhost";
const DEFAULT_RMQ_POST = "5672";
let RmqModule = RmqModule_1 = class RmqModule {
    static forRootAsync(config) {
        return {
            module: RmqModule_1,
            imports: [
                microservices_1.ClientsModule.registerAsync([
                    {
                        imports: [config_1.ConfigModule],
                        name: key_service_1.RABBITMQ_KEY.ws.key,
                        useFactory: (configService) => {
                            return {
                                transport: microservices_1.Transport.RMQ,
                                options: {
                                    urls: [`${DEFAULT_RMQ_HOST_NAME}:${DEFAULT_RMQ_POST}`],
                                    queue: key_service_1.RABBITMQ_KEY.ws.name,
                                    noAck: true,
                                    queueOptions: {
                                        durable: true,
                                        arguments: {
                                            "x-message-ttl": 5000,
                                        },
                                    },
                                    persistent: true,
                                },
                                prefetchCount: 1,
                            };
                        },
                        inject: [config_1.ConfigService],
                    },
                    {
                        imports: [config_1.ConfigModule],
                        name: key_service_1.RABBITMQ_KEY.chatai.key,
                        useFactory: (configService) => {
                            return {
                                transport: microservices_1.Transport.RMQ,
                                options: {
                                    urls: [`${DEFAULT_RMQ_HOST_NAME}:${DEFAULT_RMQ_POST}`],
                                    queue: key_service_1.RABBITMQ_KEY.chatai.name,
                                    noAck: true,
                                    queueOptions: {
                                        durable: true,
                                        arguments: {
                                            "x-message-ttl": 5000,
                                        },
                                    },
                                    persistent: true,
                                },
                                prefetchCount: 1,
                            };
                        },
                        inject: [config_1.ConfigService],
                    },
                ]),
            ],
            providers: [rmq_service_1.RmqService],
            exports: [rmq_service_1.RmqService, microservices_1.ClientsModule],
            global: true,
        };
    }
};
exports.RmqModule = RmqModule;
exports.RmqModule = RmqModule = RmqModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], RmqModule);
//# sourceMappingURL=rmq.module.js.map