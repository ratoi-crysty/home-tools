import { Module } from '@nestjs/common';
import { DelugeController } from './deluge/deluge.controller';
import { DelugeService } from './deluge/deluge.service';
import { KodiController } from './kodi/kodi.controller';
import { KodiService } from './kodi/kodi.service';

@Module({
  controllers: [DelugeController, KodiController],
  providers: [DelugeService, KodiService],
})
export class AppsModule {}
