import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { DelugeService } from './deluge/deluge.service';
import { KodiService } from './kodi/kodi.service';

@Module({
  controllers: [AppsController],
  providers: [DelugeService, KodiService],
})
export class AppsModule {}
