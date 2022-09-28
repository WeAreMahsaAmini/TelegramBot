import { Injectable, Inject } from '@nestjs/common';
import { Option } from './interfaces';
import { Telegraf, session } from 'telegraf';
//import TelegrafSessionLocal from 'telegraf-session-local';
import { BOT_MODULE_OPTIONS } from './constants/bot.constant';
import { intialSession } from './middlewares/initial-session.middleware';

@Injectable()
export class BotService {
  public readonly bot: Telegraf;

  constructor(@Inject(BOT_MODULE_OPTIONS) private readonly option: Option) {
    this.bot = new Telegraf(option.botToken);
    this.bot.use(session());
    this.bot.use(intialSession());
  }
}
