"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RmqModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RmqModule = exports.DF_NAME = void 0;
const common_1 = require("@nestjs/common");
const rmq_service_1 = require("./rmq.service");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const key_service_1 = require("./key-service");
exports.DF_NAME = "RABBITMQ_CHATAI_CONNECTION";
let RmqModule = RmqModule_1 = class RmqModule {
    static forRootAsync(config) {
        this.rootConfig = config;
        return {
            module: RmqModule_1,
            imports: [
                microservices_1.ClientsModule.registerAsync([
                    {
                        imports: [config_1.ConfigModule],
                        name: key_service_1.RABBITMQ_KEY.ws.key,
                        useFactory: (configService) => {
                            const urlName = configService.get("RMQ");
                            const queueName = configService.get("RMQ_WS");
                            console.log("urlName: ", urlName);
                            return {
                                transport: microservices_1.Transport.RMQ,
                                options: {
                                    urls: [urlName],
                                    queue: queueName,
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
                            const urlName = configService.get("RMQ");
                            const queueName = configService.get("RMQ_CHATAI");
                            return {
                                transport: microservices_1.Transport.RMQ,
                                options: {
                                    urls: [urlName],
                                    queue: queueName,
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
    static createProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createOptionsProvider(options)];
        }
        return [
            this.createOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: exports.DF_NAME,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: exports.DF_NAME,
            useFactory: async (optionsFactory) => await optionsFactory.createOptionsConfig(),
            inject: [options.useExisting || options.useClass],
        };
    }
};
exports.RmqModule = RmqModule;
exports.RmqModule = RmqModule = RmqModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], RmqModule);
//# sourceMappingURL=rmq.module.js.map