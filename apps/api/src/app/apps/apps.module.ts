import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { KodiService } from './kodi/kodi.service';

@Module({
  controllers: [AppsController],
  providers: [KodiService],
})
export class AppsModule {}
