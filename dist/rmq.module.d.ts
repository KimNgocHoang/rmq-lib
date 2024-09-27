import { DynamicModule } from "@nestjs/common";
import { OptionsConfig } from "./options.config";
export declare const DF_NAME = "RABBITMQ_CHATAI_CONNECTION";
export declare class RmqModule {
    private static rootConfig;
    static forRootAsync(config: OptionsConfig): DynamicModule;
    private static createProviders;
    private static createOptionsProvider;
}
