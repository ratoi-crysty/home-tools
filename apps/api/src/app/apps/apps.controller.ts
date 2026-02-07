import { Controller, Get, Post } from '@nestjs/common';
import { DelugeService } from './deluge/deluge.service';
import { KodiService } from './kodi/kodi.service';
import { AppStatusResponse } from './models/app-status.model';
import { AppActionResponse } from './models/app-action.model';

@Controller('apps')
export class AppsController {
  constructor(
    private readonly delugeService: DelugeService,
    private readonly kodiService: KodiService
  ) {}

  @Get('deluge/status')
  getDelugeStatus(): Promise<AppStatusResponse> {
    return this.delugeService.getStatus();
  }

  @Post('deluge/start')
  startDeluge(): Promise<AppActionResponse> {
    return this.delugeService.start();
  }

  @Post('deluge/stop')
  stopDeluge(): Promise<AppActionResponse> {
    return this.delugeService.stop();
  }

  @Get('kodi/status')
  getKodiStatus(): Promise<AppStatusResponse> {
    return this.kodiService.getStatus();
  }

  @Post('kodi/start')
  startKodi(): Promise<AppActionResponse> {
    return this.kodiService.start();
  }

  @Post('kodi/stop')
  stopKodi(): Promise<AppActionResponse> {
    return this.kodiService.stop();
  }
}
