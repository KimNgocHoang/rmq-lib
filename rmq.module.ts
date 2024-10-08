import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { RmqService } from "./rmq.service";
import { ClientProxyFactory, ClientsModule, Transport } from "@nestjs/microservices";
import { OptionsConfig, OptionsConfigAsync, OptionsConfigFactory } from "./options.config";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RABBITMQ_KEY } from "./key-service";

const DEFAULT_RMQ_HOST_NAME = "amqp://localhost";
const DEFAULT_RMQ_POST = "5672";

@Global()
@Module({})
export class RmqModule {
  static forRootAsync(config: OptionsConfig): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            imports: [ConfigModule],
            name: RABBITMQ_KEY.ws.key,
            useFactory: (configService: ConfigService) => {
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [`${DEFAULT_RMQ_HOST_NAME}:${DEFAULT_RMQ_POST}`],
                  queue: RABBITMQ_KEY.ws.name,
                  noAck: true,
                  queueOptions: {
                    durable: true,
                    arguments: {
                      "x-message-ttl": 5000, //thời gian sống của message queue sẽ mất sau 5 giây nếu ko có consumer nào xử lý
                    },
                  },
                  persistent: true,
                },
                prefetchCount: 1,
              };
            },
            inject: [ConfigService],
          },
          {
            imports: [ConfigModule],
            name: RABBITMQ_KEY.chatai.key,
            useFactory: (configService: ConfigService) => {
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [`${DEFAULT_RMQ_HOST_NAME}:${DEFAULT_RMQ_POST}`],
                  queue: RABBITMQ_KEY.chatai.name,
                  noAck: true,
                  queueOptions: {
                    durable: true,
                    arguments: {
                      "x-message-ttl": 5000, //thời gian sống của message queue sẽ mất sau 5 giây nếu ko có consumer nào xử lý
                    },
                  },
                  persistent: true,
                },
                prefetchCount: 1,
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
      providers: [RmqService],
      exports: [RmqService, ClientsModule],
      global: true,
    };
  }

  // static forRootAsync(config: OptionsConfig): DynamicModule {
  //   return {
  //     module: RmqModule,
  //     imports: [
  //       ClientsModule.registerAsync([
  //         {
  //           imports: [ConfigModule],
  //           name: DF_NAME,
  //           useFactory: (configService: ConfigService) => {
  //             return {
  //               transport: Transport.RMQ,
  //               options: {
  //                 urls: ['amqp://localhost:5672'],
  //                 queue: 'chatai_service',
  //                 noAck: true,
  //                 queueOptions: {
  //                   durable: true,
  //                   arguments: {
  //                     'x-message-ttl': 5000, //thời gian sống của message queue sẽ mất sau 5 giây nếu ko có consumer nào xử lý
  //                   },
  //                 },
  //                 persistent: true,
  //               },
  //               prefetchCount: 1,
  //             };
  //           },
  //           inject: [ConfigService],
  //         },
  //       ]),
  //     ],
  //     providers: [RmqService],
  //     exports: [RmqService, ClientsModule],
  //     global: true,
  //   };
  // }

  // private static createProviders(options: OptionsConfigAsync): Provider[] {
  //   if (options.useExisting || options.useFactory) {
  //     return [this.createOptionsProvider(options)];
  //   }
  //   return [
  //     this.createOptionsProvider(options),
  //     {
  //       provide: options.useClass,
  //       useClass: options.useClass,
  //     },
  //   ];
  // }

  // private static createOptionsProvider(options: OptionsConfigAsync): Provider {
  //   if (options.useFactory) {
  //     return {
  //       provide: DF_NAME,
  //       useFactory: options.useFactory,
  //       inject: options.inject || [],
  //     };
  //   }
  //   return {
  //     provide: DF_NAME,
  //     useFactory: async (optionsFactory: OptionsConfigFactory) => await optionsFactory.createOptionsConfig(),
  //     inject: [options.useExisting || options.useClass],
  //   };
  // }

  // static register(config: OptionsConfig): DynamicModule {
  //   return {
  //     module: RmqModule,
  //     imports: [
  //       ClientsModule.registerAsync([
  //         {
  //           imports: [ConfigModule],
  //           name: RABBITMQ_KEY.ws.key,
  //           useFactory: (configService: ConfigService) => {
  //             // const urlName = `${config.RMQ_HOST || configService.get('RMQ_HOST')}:${
  //             //   config.RMQ_PORT || configService.get('RMQ_PORT')
  //             // }`;

  //             const urlName = configService.get('RMQ');
  //             const queueName = configService.get('RMQ_WS');

  //             return {
  //               transport: Transport.RMQ,
  //               options: {
  //                 urls: ['amqp://localhost:5672'],
  //                 // urls: ['amqp://guess:guess@localhost:5672'],
  //                 queue: 'ws_service',
  //                 noAck: true,
  //                 queueOptions: {
  //                   durable: true,
  //                   arguments: {
  //                     'x-message-ttl': 5000, //thời gian sống của message queue sẽ mất sau 5 giây nếu ko có consumer nào xử lý
  //                   },
  //                 },
  //                 persistent: true,
  //               },
  //               prefetchCount: 1,
  //             };
  //           },
  //           inject: [ConfigService],
  //         },
  //         {
  //           imports: [ConfigModule],
  //           name: RABBITMQ_KEY.chatai.key,
  //           useFactory: (configService: ConfigService) => {
  //             // const urlName = `${config.RMQ_HOST || configService.get('RMQ_HOST')}:${
  //             //   config.RMQ_PORT || configService.get('RMQ_PORT')
  //             // }`;

  //             const urlName = configService.get('RMQ');
  //             const queueName = configService.get('RMQ_CHATAI');

  //             return {
  //               transport: Transport.RMQ,
  //               options: {
  //                 // urls: ['amqp://guess:guess@localhost:5672'],
  //                 urls: ['amqp://localhost:5672'],

  //                 queue: 'chatai_service',
  //                 noAck: true,
  //                 queueOptions: {
  //                   durable: true,
  //                   arguments: {
  //                     'x-message-ttl': 5000, //thời gian sống của message queue sẽ mất sau 5 giây nếu ko có consumer nào xử lý
  //                   },
  //                 },
  //                 persistent: true,
  //               },
  //               prefetchCount: 1,
  //             };
  //           },
  //           inject: [ConfigService],
  //         },
  //       ]),
  //     ],
  //     providers: [RmqService],
  //     exports: [RmqService, ClientsModule],
  //   };
  // }

  // static forRootAsync(config: OptionsConfig): DynamicModule {
  //   this.rootConfig = config;
  //   return {
  //     module: RmqModule,
  //     imports: [
  //       ClientsModule.registerAsync([
  //         {
  //           imports: [ConfigModule],
  //           name: RABBITMQ_KEY.ws.key,
  //           useFactory: (configService: ConfigService) => {
  //             // const urlName = `${config.RMQ_HOST || configService.get('RMQ_HOST')}:${
  //             //   config.RMQ_PORT || configService.get('RMQ_PORT')
  //             // }`;

  //             const urlName = configService.get('RMQ');
  //             const queueName = configService.get('RMQ_WS');

  //             return {
  //               transport: Transport.RMQ,
  //               options: {
  // urls: ['amqp://localhost:5672'],
  // // urls: ['amqp://guess:guess@localhost:5672'],
  // queue: 'ws_service',
  //                 noAck: true,
  //                 queueOptions: {
  //                   durable: true,
  //                   arguments: {
  //                     'x-message-ttl': 5000, //thời gian sống của message queue sẽ mất sau 5 giây nếu ko có consumer nào xử lý
  //                   },
  //                 },
  //                 persistent: true,
  //               },
  //               prefetchCount: 1,
  //             };
  //           },
  //           inject: [ConfigService],
  //         },
  //         {
  //           imports: [ConfigModule],
  //           name: RABBITMQ_KEY.chatai.key,
  //           useFactory: (configService: ConfigService) => {
  //             // const urlName = `${config.RMQ_HOST || configService.get('RMQ_HOST')}:${
  //             //   config.RMQ_PORT || configService.get('RMQ_PORT')
  //             // }`;

  //             const urlName = configService.get('RMQ');
  //             const queueName = configService.get('RMQ_CHATAI');

  //             return {
  //               transport: Transport.RMQ,
  //               options: {
  //                 // urls: ['amqp://guess:guess@localhost:5672'],
  //                 urls: ['amqp://localhost:5672'],

  //                 queue: 'chatai_service',
  //                 noAck: true,
  //                 queueOptions: {
  //                   durable: true,
  //                   arguments: {
  //                     'x-message-ttl': 5000, //thời gian sống của message queue sẽ mất sau 5 giây nếu ko có consumer nào xử lý
  //                   },
  //                 },
  //                 persistent: true,
  //               },
  //               prefetchCount: 1,
  //             };
  //           },
  //           inject: [ConfigService],
  //         },
  //       ]),
  //     ],
  //     providers: [RmqService],
  //     exports: [RmqService, ClientsModule],
  //   };
  // }
}
