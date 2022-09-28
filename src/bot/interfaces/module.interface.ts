import { ModuleMetadata, Type } from '@nestjs/common';

export interface BotModuleOptions {
  botToken?: string;
}

export interface BotAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<BotModuleOptions>;
  useClass?: Type<BotModuleOptions>;
  useFactory?: (...args: any[]) => Promise<BotModuleOptions> | BotModuleOptions;
  inject?: any[];
}

export interface BotOptionsFactory {
  createBotOptions(): Promise<BotModuleOptions> | BotModuleOptions;
}
