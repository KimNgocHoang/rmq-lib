import { ModuleMetadata, Type } from '@nestjs/common';
export interface OptionsConfig {
    RMQ_HOST?: string;
    RMQ_PORT?: string;
}
export interface OptionsConfigFactory {
    createOptionsConfig: () => Promise<OptionsConfig> | OptionsConfig;
}
export interface OptionsConfigAsync extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useClass?: Type<OptionsConfigFactory>;
    useExisting?: Type<OptionsConfigFactory>;
    useFactory?: (...args: any[]) => Promise<OptionsConfig> | OptionsConfig;
}
