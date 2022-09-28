import { Injectable } from '@nestjs/common';
import { CTX } from 'src/bot/interfaces';
import { Telegraf } from 'telegraf';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import * as fs from 'fs';

import { ConfigService } from '@nestjs/config';
import { Celebrity, CelebrityKeys } from './interfaces/celebrity.interface';

@Injectable()
export class CelebrityWallService {
  bot: Telegraf = null;
  celebritiesList: Celebrity[] = [];

  constructor(private configService: ConfigService) {
    this.refreshList();
  }

  private async refreshList(realData = false) {
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

  private async fetchProfileImage(name: string) {}

  showCelebrities(ctx: CTX): any {}

  getList() {}
}
