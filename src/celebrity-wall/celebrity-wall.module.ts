import { Module } from '@nestjs/common';
import { CelebrityWallService } from './celebrity-wall.service';

@Module({
  providers: [CelebrityWallService],
  exports: [CelebrityWallService],
})
export class CelebrityWallModule {}
