import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot/bot.service';
import { CTX } from './bot/interfaces';
import { CelebrityWallService } from './celebrity-wall/celebrity-wall.service';
import { Callback } from './common/enums/callback.enum';
@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private celebrityWallService: CelebrityWallService,
    private botService: BotService,
  ) {
    //this.bot = new Telegraf(this.configService.get<string>('bot.token'));
  }

  launchBot(): void {
    const welcomeMessage = this.configService.get<string>('welcomeMessage');
    this.botService.bot.start((ctx) => ctx.reply(welcomeMessage));

    this.botService.bot.command('celebritywall', (ctx: CTX) => {
      this.celebrityWallService.showCelebrities({ ctx });
    });

    this.initializeCallbacks();

    this.botService.bot.launch();
  }

  initializeCallbacks(): void {
    this.botService.bot.action(Callback.NextCelebrity, (ctx) => {
      this.celebrityWallService.callbackHandler(ctx);
    });

    this.botService.bot.action(Callback.PrvCelebrity, (ctx) => {
      this.celebrityWallService.callbackHandler(ctx);
    });
  }

  intializeServices(): void {}
}
