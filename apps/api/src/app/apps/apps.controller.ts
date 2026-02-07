import { Controller, Get, Post } from '@nestjs/common';
import { KodiService } from './kodi/kodi.service';
import { AppStatusResponse } from './models/app-status.model';
import { AppActionResponse } from './models/app-action.model';

@Controller('apps')
export class AppsController {
  constructor(private readonly kodiService: KodiService) {}

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
