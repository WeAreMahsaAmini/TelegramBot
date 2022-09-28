import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { CelebrityWallService } from './celebrity-wall.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [CelebrityWallService],
  exports: [CelebrityWallService],
})
export class CelebrityWallModule {}
