import { Injectable } from '@nestjs/common';
import { CTX } from 'src/bot/interfaces';
import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as fs from 'fs';

import { ConfigService } from '@nestjs/config';
import { Celebrity, CelebrityKeys } from './interfaces/celebrity.interface';
import { Callback } from 'src/common/enums/callback.enum';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { validURL } from './util';

@Injectable()
export class CelebrityWallService {
  bot: Telegraf = null;
  celebritiesList: Celebrity[] = [];

  constructor(private configService: ConfigService) {
    const realData =
      parseInt(this.configService.get<string>('config.realData')) === 1;
    this.init();
  }

  private async init() {
    this.celebritiesList = await this.refreshList(false);
  }

  private async refreshList(realData = false): Promise<Celebrity[]> {
    if (realData) {
      const credentialData = {
        private_key: this.configService.get<string>('doc.privateKey'),
        client_email: this.configService.get<string>('doc.clientEmail'),
      };

      const doc = new GoogleSpreadsheet(
        this.configService.get<string>('doc.id'),
      );
      await doc.useServiceAccountAuth(credentialData);
      await doc.loadInfo();
      const sheet =
        doc.sheetsByTitle[this.configService.get<string>('doc.sheetName')];
      const rows = (await sheet.getRows()).filter(
        (celebritiy) => celebritiy.Name,
      ) as unknown as Celebrity[];

      rows.map((celebritiy) => {
        const celebritiesData = {};
        for (const key of CelebrityKeys) {
          celebritiesData[key] = celebritiy[key];
        }
        this.celebritiesList.push(celebritiesData as Celebrity);
      });
    } else {
      return JSON.parse(
        fs.readFileSync(
          __dirname + '/../../sample-data/celebrity-data.json',
          'utf-8',
        ),
      );
    }
  }

  private async fetchProfileImageByName(name: string) {
    return 'https://content.solsea.io/files/thumbnail/1643031598441-422563377.jpg';
  }

  async showCelebrities(options: {
    ctx: CTX;
    multiplier?: number;
  }): Promise<void> {
    const { ctx, multiplier = 1 } = options;
    const celebrityId = (ctx.session.lastCelebrityId || 0) + multiplier;
    const celebrity = this.celebritiesList[celebrityId];
    if (celebrity) {
      celebrity.ProfileImage = await this.fetchProfileImageByName(
        celebrity.Name.split(' ').join('-'),
      );
      ctx.session.lastCelebrityId = celebrityId;

      const caption = `Name: ${celebrity.Name}`;
      const socialMediaButtons: InlineKeyboardButton[] = [];

      if (celebrity.Instagram && validURL(celebrity.Instagram))
        socialMediaButtons.push({
          text: 'Instagram',
          url: celebrity.Instagram,
        });

      if (celebrity.Twitter && validURL(celebrity.Twitter))
        socialMediaButtons.push({
          text: 'Twitter',
          url: celebrity.Twitter,
        });

      ctx.sendPhoto(celebrity.ProfileImage, {
        caption,
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Next', callback_data: Callback.NextCelebrity },
              { text: 'Previous', callback_data: Callback.PrvCelebrity },
            ],
            socialMediaButtons,
            [{ text: 'Search By name', callback_data: 'celebrity_search' }],
          ],
        },
      });
    } else {
      // celebrity not found
      ctx.sendMessage('There is no more any Celebrity here');
    }
  }

  async callbackHandler(ctx: CTX) {
    const data: any = ctx;
    const callbackData = data.update?.callback_query.data;
    ctx.answerCbQuery();
    switch (callbackData) {
      case Callback.NextCelebrity:
        this.showCelebrities({ ctx });
        break;
      case Callback.PrvCelebrity:
        this.showCelebrities({ ctx, multiplier: -1 });
        break;
    }
  }
}
