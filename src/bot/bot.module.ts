import { DynamicModule, Module, Provider } from '@nestjs/common';
import { BotAsyncOptions, BotOptionsFactory } from './interfaces/';
import { BOT_MODULE_OPTIONS } from './constants/bot.constant';
import { BotService } from './bot.service';

@Module({
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {
  static registerAsync(options: BotAsyncOptions): DynamicModule {
    return {
      module: BotModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(options: BotAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: BotAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: BOT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: BOT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: BotOptionsFactory) =>
        await optionsFactory.createBotOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
