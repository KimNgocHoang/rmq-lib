import { DynamicModule } from "@nestjs/common";
import { OptionsConfig } from "./options.config";
export declare class RmqModule {
    static forRootAsync(config: OptionsConfig): DynamicModule;
}
