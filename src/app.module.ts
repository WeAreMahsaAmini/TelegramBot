import { Module, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CelebrityWallModule } from './celebrity-wall/celebrity-wall.module';
import configuration from './config/configuration';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    BotModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        botToken: configService.get<string>('bot.token'),
      }),
    }),
    CelebrityWallModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CelebrityWallModule,
  ],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private appService: AppService) {}

  onModuleInit() {
    console.log(`Starting...`);
    this.appService.launchBot();
  }
}
