import { Injectable } from '@nestjs/common';
import { CTX } from 'src/bot/interfaces';
import { Telegraf } from 'telegraf';

@Injectable()
export class CelebrityWallService {
  bot: Telegraf = null;
  setBot(bot: Telegraf): void {
    this.bot = bot;
  }
  showCelebrities(ctx: CTX): any {
  }

  getList() {}
}
